const ejs     = require('ejs');
const exec    = require('exec');
const express = require('express');
const fs      = require('fs-extra');
const path    = require('path');
const config  = require('./config');

const LogPath = path.join(__dirname, config.logPath);
if (!fs.existsSync(LogPath)) fs.writeFileSync(LogPath, '[]');

const app = express();
app.configure(() => app.use(express.static(__dirname + '/')));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use('/assets', express.static('views/assets'));
app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Headers', 'If-Modified-Since, Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	(req.method == 'OPTIONS') ? res.send(200) : next();
});

app.get('/', (req, res) => {
	res.header('Cache-Control', 'max-age=0, private, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.render('index', {log: JSON.parse(fs.readFileSync(LogPath))});
});

app.get('/log', (req, res) => {
	res.header('Cache-Control', 'max-age=0, private, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.header('Expires', 0);
	res.json(JSON.parse(fs.readFileSync(LogPath)));
});

app.post(/.*/, (req, res) => {
	console.log(`[Hook] ${req.method} to ${req.url}`);
	req.on('data', chunk => {
		const body = JSON.parse(chunk);
		console.log('-----------DATA-----------');
		console.log(body);
		console.log('-----------END-----------');

		let Project = req.url.toString();
		Project     = Project.replace(/\//g, '');

		if (body.event !== 'push' && !config.projects[Project]) return;
		const ProjectConfig = config.projects[Project];
		let Item            = {};

		try {
			if (ProjectConfig.type === 'coding') {
				Item = {
					repo   : {
						name: body.repository.name,
						url : body.commits[0].web_url
					},
					user   : {
						name: body.user.global_key,
						img : body.user.avatar
					},
					message: body.commits[0].short_message,
					branch : body.ref
				};
			} else if (ProjectConfig.type === 'github') {
				Item = {
					repo   : {
						name: body.repository.name,
						url : body.commits[0].url
					},
					user   : {
						name: body.sender.login,
						img : body.sender.avatar_url
					},
					message: body.commits[0].message,
					branch : body.ref
				};
			} else {
				console.error('Wrong Type');
				return;
			}
			Item.project = Project;
			Item.time    = new Date();
			console.log(JSON.stringify(Item, null, 2));

			if (ProjectConfig.branch && Item.branch !== `refs/heads/${ProjectConfig.branch}`) {
				console.error(`[Branch] ${Item.branch} !== refs/heads/${ProjectConfig.branch}`);
				return;
			}
			if (ProjectConfig.message && Item.message !== ProjectConfig.message) {
				console.error(`[Message] ${Item.message} !== ${ProjectConfig.message}`);
				return;
			}

			// bash
			const scripts = [
				`cd ${ProjectConfig.dir}`,
				ProjectConfig.bash.join(config.commandConnect)
			].join(config.commandConnect);

			exec(scripts, (err, out) => {
				const OutLog = [out, err].join('\n');
				console.log('-----------BASH-----------');
				console.log(OutLog);
				console.log('-----------DONE-----------');
				Item.scripts = scripts;
				Item.out     = OutLog;
				// save
				const Log    = JSON.parse(fs.readFileSync(LogPath));
				Log.unshift(Item);
				if (Log[config.maxLength]) Log.pop();
				fs.writeFileSync(LogPath, JSON.stringify(Log));
			});
		} catch (e) {
			console.error('[Item Build] Error', e);
			return;
		}
	});
	res.send(`<div>[Hook] ${req.method} to ${req.url}</div>`);
});

app.listen(config.port, () => {
	console.log(`[Hook] server listening on port ${config.port}`);
});




