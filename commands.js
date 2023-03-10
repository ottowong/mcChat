var seedrandom = require('seedrandom');
require('dotenv').config()

// hardcode some accounts that try to break the bot lol
// probably should use the .env for this
const blacklist = []

const fortunes = ["Reply hazy, try again","Excellent Luck","Good Luck","Average Luck","Bad Luck","Good news will come to you by mail","You will meet a dark handsome stranger","Better not tell you now","Outlook good","Very Bad Luck","Godly Luck"]

const excludeArrFromArr = (arr, exclude) => {
    const newArr = [];
    arr.forEach((val) => {
        if (!exclude.includes(val)) {
            newArr.push(val)
        }
    })
    return newArr;
}

module.exports.command = (bot) => {
 
	bot.commands['help'] = async function (args, m, username) {
		const commands = Object.keys(bot.commands)
		if (m == process.env.prefix+"help" && !(blacklist.includes(username.toLowerCase()))){
	        	bot.chat(`>Commands: `+process.env.prefix+`${commands.join(', '+process.env.prefix)}, "/kill count"`)
		}
	}

    bot.commands['r'] = async function (args, fullmessage, username) {
	// should move this to .env
        const maxModifier = 1000
        const maxNumberOfRolls = 10
        const maxNumberOfDice = 10
        const maxSides = 1000

        let invalid = false

        // this is kinda retarded, fix later maybe (the else if stuff)
        if(args[1] == "help"){
            bot.chat(">Roll dice like \"!r 1d20+2d10+5\". To subtract a modifier you must do \"+-\".")
            bot.chat(">Do not roll more than "+maxNumberOfRolls+" dice with more than "+maxSides+" sides with a modifier greater than "+maxModifier+" or more than "+maxNumberOfDice+" different dice.")
        }
        // else if (messagestring == "!r") {
        //     // roll 1d20
        //     const d20roll = Math.floor(Math.random() * 20) + 1
        //     bot.chat(">Rolling 1d20: "+d20roll)
        // }
        else{
            try {
                let messagestring = fullmessage.substr(3).toLowerCase().replace(/\s/g, '')
                // !r is shorthand for !r 1d20
                if (fullmessage == process.env.prefix+"r") {
                    messagestring = "1d6"
                }
                
                // main stuff goes here
                let counter = 0;
                let rollstring = (username+" rolled: ")
                let rollsList = messagestring.split("+")
                var i;
                for(i=0; i < rollsList.length; i++){
                    rollsList[i] = rollsList[i].split("d")
                }
                if(rollsList.length > maxNumberOfDice){
                    invalid = true;
                } else {
                    for(i=0; i < rollsList.length; i++){
                        if(rollsList[i].length == 2){
                            // check if the number of rolls/sides is valid
                            if(rollsList[i][0] <= maxNumberOfRolls && rollsList[i][1] <= maxSides){
                                if(i != 0){
                                    rollstring += "; "
                                }
                                rollstring += rollsList[i][0] + " d" + rollsList[i][1]+":";
                                var a;
                                for(a=0; a < rollsList[i][0]; a++){
                                    let rando = Math.floor(Math.random() * rollsList[i][1])+1
                                    console.log(rando)
                                    counter += rando
                                    // if it's not the first roll, add a comma to the output string
                                    // e.g. the 2nd roll of 2d10
                                    if(a != 0){
                                        rollstring += ","
                                    }
                                    rollstring += " "+rando
                                }
                            } else {
                                invalid = true;
                            }
                        // if the roll is a modifier (e.g. +5)
                        } else if(rollsList[i].length == 1) {
                            if(rollsList[i][0] > maxModifier){
                                invalid = true;
                            } else {
                                counter += Number(rollsList[i][0])
                                console.log(counter)
                                rollstring += "; "
                                if(rollsList[i][0] >= 0){
                                    rollstring += "+"
                                }
                                rollstring += rollsList[i][0]
                            }
                        }
                    }
                }
                if(invalid == false){
                    rollstring += "; resulting in: "+counter+"."
                    bot.chat(">"+rollstring)
                } else {
                    bot.chat(">You fucked up, retard. !r help for help");
                }

                console.log(rollstring)
                console.log(rollsList)
                console.log(invalid)
              }
              catch(err) {
                bot.chat(">You fucked up, retard. !r help for help");
                console.log(err.message)
              }
        }
    }
	
    bot.commands['fortune'] = async function (args) {
        const i = Math.floor(Math.random() * fortunes.length)
        bot.chat('>' + fortunes[i]);
    }

    bot.commands['seed'] = async function (args) {
      bot.chat(">7540332306713543803")
    }

    bot.commands['flip'] = async function (args, m, username) {
        // flip a coin
        const i = Math.floor(Math.random() * 2)
        let coin = ""
        if(i==0){
            coin = "Heads"
        }
        else{
            coin = "Tails"
        }
        bot.chat(">" + username + " flipped a coin: " +  coin)
    }

    bot.commands["height"] = async function(args, m, username) {
        if(args[1]){
            if(args[1].toLowerCase() === bot.username.toLowerCase()){ 
                bot.chat(">"+args[1]+" is 7'")
            } else{
                var myrng = (seedrandom(args[1].toLowerCase()));
                
                var feet = Math.floor(myrng() * (6 - 4 + 1) + 4 )
                var inches = Math.floor(myrng() * (11 - 0 + 1) + 0 )
                if(inches === 0){
                    // don't show inches if inches is 0
                    bot.chat(">"+args[1]+" is "+feet+"'")    
                }else{
                    bot.chat(">"+args[1]+" is "+feet+"'"+inches+'"')
                }
            }
        } else { // run for themself
            var myrng = (seedrandom(username.toLowerCase()));
            var feet = Math.floor(myrng() * (6 - 5 + 1) + 5 )
            var inches = Math.floor(myrng() * (11 - 0 + 1) + 0 )
			if(inches === 0){
                // don't show inches if inches is 0
                bot.chat(">You are "+feet+"'")    
            }else{
                bot.chat(">You are "+feet+"'"+inches+'"')
            }
        }

    }

    bot.commands["gaydar"] = async function(args, m, username) {
        var choice = ["gay", "straight"]
	try{
		if(args[1].length < 3 ){ // for args less than 3 characters long. - mainly for people using launchers that append stuff to the end of their messages
			bot.chat("Invalid argument. You are probably gay.")
			return
		}
	} catch {

	}
        if(args[1]){
            if(args[1].toLowerCase() === bot.username.toLowerCase()){
                bot.chat(">I, "+args[1]+" am straight! Don't you forget it.")
            } else{
                var myrng = (seedrandom(args[1].toLowerCase()));
                var gay = Math.floor(myrng() * (1 - 0 + 1) + 0 )

                bot.chat(">"+args[1]+" is "+choice[gay])    
            }
        } else { // run for themself
            var myrng = (seedrandom(username.toLowerCase()));
            var gay = Math.floor(myrng() * (1 - 0 + 1) + 0 )
            bot.chat(">You are "+choice[gay]+", "+username)
        }
    }

    bot.commands["discord"] = async function(args, m, username) {
	if (m == process.env.prefix+"discord" && !(blacklist.includes(username.toLowerCase())) ){
	        bot.chat(">JOIN THE SADLADS DISCORD: http://discord.sadlads.com") // todo: put this message in the .env
	}
    }

}
