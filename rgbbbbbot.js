var fs = require("fs");

const token = JSON.parse(fs.readFileSync('./token.json'));

var data = JSON.parse(fs.readFileSync("./data.json"));

var roleName = data.roleName;

const { Client, Intents } = require('discord.js');
const Discord = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("message", (message) => {
    //Séparateur de message
    const args = message.content.split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let arg = args.toString();

    let userRole = message.guild.roles.cache.find((role) => role.name === roleName);

    //Mise en place du changement de couleur du grade indiqué
    if(message.content === "!rgb+") {
        const rgbEmbed = new Discord.MessageEmbed()
            .setTitle("RGB STARTED !!!")

        //message.channel.send(rgbEmbed);
        myLoop(userRole);
    }

    //Récupération du role sur lequel mettre en place le changement de couleur
    if(message.content.startsWith("!role+")) {
        if(arg === "" || arg === " ") {
            const emptyRoleEmbed = new Discord.MessageEmbed()
                .setTitle("Empty role !")
                .setDescription("To start the animation, you must type the name of your role after *!roleName* ! \n For example : *!roleName RGBMASTER* !")

            message.channel.send(emptyRoleEmbed);
        }
        else {
            let JSONdata ={
                "token": token,
                "roleName": arg.replace(",", " ")
            }
            fs.writeFileSync("./data.json", JSON.stringify(JSONdata));
            roleName = arg.replace(",", " ");
            const roleNameEmbed = new Discord.MessageEmbed()
                .setTitle("Role RGB")
                .setDescription("Nouveau role RGB : " + roleName)

            message.channel.send(roleNameEmbed);
        }
    }

    //Commande permettant de vérifier le nom du role
    if(message.content === "!checkName+") {
        const checkNameEmbed = new Discord.MessageEmbed()
            .setTitle("RoleName")
            .setDescription("The actual roleName is : " + roleName)

        message.channel.send(checkNameEmbed);
    }

    //Affichage d'un message d'aide pour comprendre l'utilisation du bot
    if(message.content === "!help+") {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle("RGBBBBBOT HELP")
            .setDescription("The **RGBBBBBOT** role must be higher than the role you want to animate !\n Then, type *!roleName* with the name of the role you want to animate ! \n And, just type *!rgb* !")

        message.channel.send(helpEmbed);
    }

});



                  //  start the loop

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var boucleRequete = 1;

function myLoop(userRole) {
  setTimeout(function() {
    var rgb1 = getRandomInt(256);
    var rgb2 = getRandomInt(256);
    var rgb3 = getRandomInt(256);
    userRole.setColor(RgbToHex("rgb("+rgb1+","+rgb2+","+rgb3+")"));
    boucleRequete++;
    if (boucleRequete < 500) {
      myLoop(userRole);
    }
  }, 750)
}

var RgbToHex = function (string) {
    if( /rgba?\(0,0,0,0\)/.test(string.replace(new RegExp(' ', 'g'), '')) ){
        return "transparent";
    }
    var v = string.replace(/[rgb|ba()]/g, "").split(",");
    var hex0 = parseInt(v[0]).toString(16);
    var hex1 = parseInt(v[1]).toString(16);
    var hex2 = parseInt(v[2]).toString(16);
    return ('#' + (hex0.length == 1 ? "0" + hex0 : hex0).toString() + (hex1.length == 1 ? "0" + hex1 : hex1).toString() + (hex2.length == 1 ? "0" + hex2 : hex2).toString()).toLocaleUpperCase();
}

client.login(token);
