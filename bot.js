var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var request = require("request");
var cheerio = require("cheerio");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on("guildMemberAdd", function(member) {
    logger.info("New Member: " + member.id);
    bot.sendMessage({
        to: '378217403370438657',
        message: '<@' +  member.id + '>, witaj na Kernelowych Botach!'
    });
});

var blacklist = ['java'];

bot.on('message', function (user, userID, channelID, message, evt) {
    message = message.toLowerCase();
    blacklist.forEach(function (element, index, array) {
        if(message.indexOf(element) !== -1) {
            bot.deleteMessage({
                channelID: channelID,
                messageID: evt.d.id
            }, function (err) {
                if(err)
                    logger.error(err)
            });
        }
    });
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'hello':
                bot.sendMessage({
                    to: channelID,
                    message: 'Witaj, <@' + userID + '>!'
                });
                break;
            case 'ask':
                var answers = ['Oczywiście', 'No co ty!', 'Niewykluczone', 'No', 'Tiaaa...', 'Definitywnie!'];
                bot.sendMessage({
                    to: channelID,
                    message: '*- ' + args.join(' ') + '* \n' + answers[randomIndex(answers.length)]
                });
                break;
            case 'book':
                request({
                    uri: 'https://www.packtpub.com/packt/offers/free-learning/'
                }, function (error, response, body) {
                    logger.info('PacktPub daily info');
                    var $ = cheerio.load(body);
                    var title = $(".dotd-title > h2").text();
                    bot.sendMessage({
                        to: channelID,
                        message: 'New Packt free ebook **' + title + '**'
                    });
                });
                break;
            case 'test':
                bot.sendMessage({
                    to: '378217403370438657',
                    message: '<@' +  userID + '>, witaj na Kernelowych Botach!'
                });
                break;

        }
    }
});

function randomIndex(length){
    return Math.floor((Math.random() * length));
}