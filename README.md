# wekhook

`node.js` `express` `ejs`

wekhook tool on server side with graphical interface, receive hook messages to run bash commands.

> Support: **Github / Coding**

- [Demo](http://hook.canisminor.cc/)

## config

```js
const projects = {
	example: { // http://hook.xxxx.xxx/example -> example
		type   : 'github',  // github || coding
		message: false, // false || commit message
		branch : 'master', // allowed branch
		dir    : '~/example/', // cd repo path on server
		bash   : ['git pull', 'yarn build'] // bash command to run
	},
	...
}

module.exports = {
	port     : 8888, // port to listen
	maxLength: 50, // max messages to store
	logPath  : 'log.json', // log path
	projects : projects
};
```

## usage

```
# edit nginx
# edit config in ./config.js
$ npm i -g forever # install forever
$ yarn # install package
$ yarn start # forever start
```