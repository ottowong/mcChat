const http = require('http');
const https = require('https');

const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require('fs');


var requestify = require('requestify');


['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, () => {

    const channel = client.channels.cache.get(process.env.discordChannel);
    var sigEmbed = new Discord.MessageEmbed()
	.setColor(0xFF0000)
	.setDescription(signal)
    channel.send({ embed: sigEmbed });

    setTimeout(() => { // shit code, wait 1 second before exiting on sigint/term/quit
      process.exit();
    }, 1000)
  }));

function cleanMarkdown(text)
{
	text = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
        text = text.replace(/(\*|_|`|~|\\)/g, '\\$1');
	return text
}

function formatDate(option = 3)
{
	// 3 = all
	// 2 = yyyy-mm-dd
	// 1 = hh:mm:ss
        let current = new Date();
	let dateTime = ""
	let cDate = ""
	let cTime = ""

	let year = current.getFullYear().toString()
	let month = (current.getMonth() + 1).toString()
        let day = current.getDate().toString()

	let hour = current.getHours().toString()
	let minute = current.getMinutes().toString()
	let second = current.getSeconds().toString()

	if(month.length < 2)
	{
		month = "0" + month
	}
	if(day.length < 2)
	{
		day = "0" + day
	}
	if(hour.length < 2)
	{
		hour = "0" + hour
	}
	if(minute.length < 2)
	{
		minute = "0" + minute
	}
	if(second.length < 2)
	{
		second = "0" + second
	}

	cDate = year + '-' + month + '-' + day;
        cTime = hour + ":" + minute + ":" + second;
        if(option == 2 || option == 3) // date
	{
		dateTime += cDate
	}
	if(option == 3){dateTime += " "} // add space for both
	if(option == 1 || option == 3) // time
	{
		dateTime += cTime
	}
        return(dateTime);
}

module.exports.plugin = (bot) => {
    
    // login
    client.login(process.env.discordToken).then(() => {
        console.log("Logged in as: "+client.user.tag);
    });

    // when a message is sent to minecraft
    bot.on('chat', function (username, message, translate, jsonMsg, matches) {
        const channel = client.channels.cache.get(process.env.discordChannel);
	console.log("<"+username+"> : "+message)
	console.log(jsonMsg)
	try
	{
		var uuid = bot.players[username].uuid
		var chatEmbed = new Discord.MessageEmbed()
			.setColor(0xFFFFFF)
	        	.setAuthor(username, 'https://crafatar.com/avatars/'+uuid )
	            	.setDescription(cleanMarkdown(message))
		fs.writeFile("./log/"+formatDate(2)+".txt", "[" + formatDate(1) + "] " + username + ": " + message + "\n", { flag: "a+" }, err => {});
	}
	catch(error) // probably a whisper. This is bad coding :)
	{
		console.log(error)
		var chatEmbed = new Discord.MessageEmbed()
                        .setColor(0x0099FF)  
			.setAuthor(username)
                        .setDescription(message)
	}
	if (message.startsWith(">")) // greentext. could probably do something with the 'color' field in json but I'm too lazy.
	{
		chatEmbed.setColor(0x00FF00)
		if(message.startsWith("> "))
		{
			chatEmbed.setDescription("\\" + cleanMarkdown(message))
		}
	}
	if (username.toLowerCase() == bot.username.toLowerCase())
	{
		chatEmbed.setColor(0x0000FF)
	}
	try
	{
		if(jsonMsg.extra[0].json) //whisper
		{
			chatEmbed.setColor(0xFF33DD)
			chatEmbed.setDescription(message.substring(message.indexOf(":") + 1 ))
		}
	}
	catch(error)
	{
	}
	channel.send({ embed: chatEmbed });
	
        //channel.send("**<"+username+">** "+message)
    })

	bot.on('message', function (jsonMsg, position, sender, verified) {
		const channel = client.channels.cache.get(process.env.discordChannel);
		try{
			if(jsonMsg.extra[0].color == "light_purple"){return} // ignore whisper
			//console.log(jsonMsg.extra[0].json)
			//console.log("whisper")
			//console.log(jsonMsg)
			var whisperStr = ""
			for (let i = 0; i < jsonMsg.extra.length; i++)
			{
				whisperStr = whisperStr + jsonMsg.extra[i]
			}
			console.log(whisperStr)

			whisperEmbed = new Discord.MessageEmbed()
                                .setColor(0x00989b)
                                .setDescription(whisperStr)
                        channel.send({ embed: whisperEmbed })
			return;

		} catch {
			
		}

		//console.log(bot.players.username)


		//console.log(playerList)
		//console.log(position)
		//console.log(jsonMsg.text)
		if(position == "system" && jsonMsg.text){
			try{
			//console.log(jsonMsg.text)
			systemEmbed = new Discord.MessageEmbed()
				.setColor(0x838383)
				.setDescription(jsonMsg.text)
			channel.send({ embed: systemEmbed });
			} catch {

			}
		} else {
			//console.log(sender)
			//console.log(jsonMsg)
			//console.log()
		}
	});
	bot.on('error', function(err){
		const channel = client.channels.cache.get(process.env.discordChannel);
                errorEmbed = new Discord.MessageEmbed()
                        .setColor(0xFF0000)
                        .setDescription(err)
                channel.send({ embed: errorEmbed });
		setTimeout(() => {
			process.exit(1)
		}, 1000)
    	})

	bot.on('kicked', function(reason, loggedIn) {
		const channel = client.channels.cache.get(process.env.discordChannel);
		kickedEmbed = new Discord.MessageEmbed()
                	.setColor(0xFF0000)
                       	.setDescription(reason)
		channel.send({ embed: kickedEmbed });
		setTimeout(() => {
			process.exit(1)
		}, 1000)
	});

	bot.on('end', function() {
		const channel = client.channels.cache.get(process.env.discordChannel);
		kickedEmbed = new Discord.MessageEmbed()
                	.setColor(0xFF0000)
                       	.setDescription("end")
		channel.send({ embed: kickedEmbed });
		setTimeout(() => {
			process.exit(0)
		}, 1000)
	});

    // when a message is sent to discord
    client.on("message", msg => {
        // ignore the bot's own messages
        if(msg.author.id === client.user.id) return;
        
        bot.chat((msg.author.tag+": "+msg.content).slice(0,239));
	return;
    });   
}
