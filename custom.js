const fortunes = [
    "Everyone agrees you are the best", 
    "Stop searching forever. Happiness is just next to you. Reach for the cop's gun", 
    "The difference between a flower and a weed is judgement:this will make ugly people feel better", 
    "Bad luck and ill misfortune will infest your little soul for all eternity", 
    "Look right... now look left... now look forward (do this really fast) do you feel any different? Good you should feel dizzy. This is the way of the Chinese Masta", 
    "The cooler you think you are the dumber you look", 
    "A focused mind is one of the most powerful forces in the universe. Unless it's your mind... better off leaving this one to the professionals", 
    "The man or woman you desire feels the same way about you. But does she/he feel the same way about the woman or man inside of you? 50/50 chance, take it anyway.", 
    "Your greatest dream is nothing true. Sorry typo, mean to say greatest dream is coming true. God looks after you especially, you are special to him, more than anyone else. Eat more rice.", 
    "A very attractive and wealthy person has a message for you: ...We're sorry, we can't find the rest of the original message! But it was important.", 
    "You are admired by everyone for your talent and ability. Don't show this message to anyone else, they'll get jealous", 
    "All your sorrows will vanish please note we make no guarantee as to how, exactly"
]

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
    
	bot.commands['fortune'] = async function (args) {
        const i = Math.floor(Math.random() * fortunes.length)
        bot.chat('>' + fortunes[i]);
    }

    bot.commands['roll'] = async function (args, fullmessage, username) {
        const maxModifier = 1000
        const maxNumberOfRolls = 10
        const maxNumberOfDice = 10
        const maxSides = 1000

        let invalid = false

        // this is kinda retarded, fix later maybe (the else if stuff)
        if(args[1] == "help"){
            bot.chat(">Roll dice like \"!roll 1d20+2d10+5\". To subtract a modifier you must do \"+-\".")
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
                if (fullmessage == "!roll") {
                    messagestring = "1d20"
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

    // bot.commands["test"] = async function(args) {
    //     bot.chat(args[0])
    // }
}
