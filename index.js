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

bot.commands = {}
// load commands
const commands = require("./commands.js")
commands["command"](bot)
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

  bot.on('chat', function (username, message) {
    // ignore messages from itself
    // if (username === bot.username) return
    // ignore anyone whispering to the bot
    if(username === "whispers") return
    // console.log(message.toString())
    // check if the message starts with the prefix

    try{
      if(message.startsWith(process.env.prefix) && bot.commands[message.substr(1).split(" ")[0]])
      {
	console.log("command detected.")
	console.log
        if((Date.now() - lastCommand) < (1000 * 1.5)) // n seconds
        {
	  console.log("commands firing too quick!")
          lastCommand = Date.now()
          return
        }
        lastCommand = Date.now()
      }
    } catch { return }

    if(message.startsWith(process.env.prefix)){
      const fullmessage = message.toLowerCase()
      const args = message.substr(1).split(" ")
      // check if the command exists
      if(bot.commands[args[0]]){
	  console.log("<"+username+"> "+message)
          bot.commands[args[0]](args, fullmessage, username)
      }
    }
  })

  // Log errors and kick reasons:
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
