# wekhook

`node.js` `express` `ejs`

wekhook tool on server side with graphical interface, receive hook messages to run bash commands.

> Support: **Github / Coding**

## Demo

You can visit this [Demo Site](http://hook.canisminor.cc/)

![](https://github.com/canisminor1990/webhook/blob/master/demo.png?raw=true)

## Config

```js
const projects = {
	example: { // location pathname -> http://hook.xxxx.xxx/example
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
	commandConnect: '&&', // fish shell change this to ";"
	projects : projects
};
```

## Usage

```bash
# edit nginx
# edit config in ./config.js

$ npm i -g forever # install forever

$ yarn # install package

$ yarn start # forever start
```

## Contact
- **Author** - [Canis Minor](https://github.com/canisminor1990)
- **Email** - <i@canisminor.cc>
