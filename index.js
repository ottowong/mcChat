require('dotenv').config()
const { utils } = require('aes-js')
const mineflayer = require('mineflayer')
var tpsPlugin = require('mineflayer-tps')(mineflayer)

//const mineflayerViewer = require("prismarine-viewer").mineflayer

let lastCommand = new Date();

console.log("Trying to Join "+process.env.host+":"+process.env.port)
var options = {
  host: process.env.host,
  port: process.env.port,
  username: process.env.mcEmail,
  password: process.env.mcPassword,
  version: process.env.version,
  auth: process.env.auth
}

var bot = mineflayer.createBot(options);

bot.loadPlugin(tpsPlugin)

bindEvents(bot);

// load discord plugin
const discordPlugin = require("./discord.js")
discordPlugin["plugin"](bot)

function formatDate()
{
	let current = new Date();
	let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
	let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
	let dateTime = cDate + ' ' + cTime;
	return(dateTime);
}

function bindEvents(bot){

  bot.on('login', () => {

//    setInterval(() => {
//      bot.chat("spam")
//    }, 20000)

    console.log("Joined Server Successfully.", formatDate())
  });

  bot.on('kicked', function(reason, loggedIn) {
    console.log(reason, formatDate())
    //process.exit(1)
  });

  bot.on('error', function(err){
    console.log(err, formatDate())
    //process.exit(1)
  });

  bot.on('end', function(){
    //process.exit(0)
  });
}
