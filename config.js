const projects = {
	'example-coding': {
		type   : 'coding',
		message: false,
		branch : 'master',
		dir    : '~/example-coding-dir/',
		bash   : ['git reset --hard', 'git pull']
	},
	'example-github': {
		type   : 'github',
		message: 'autobuild',
		branch : 'master',
		dir    : '~/example-github-dir/',
		bash   : ['git reset --hard', 'git pull', 'yarn build']
	}
};

module.exports = {
	port          : 8888,
	maxLength     : 50,
	logPath       : 'log.json',
	projects      : projects,
	commandConnect: '&&'
};