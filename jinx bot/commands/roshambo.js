let playing = false;
let sendInvalidMessage;
const Discord = require('discord.js');

module.exports.run = (prefix, client, message, args) => { 
    if (playing == true) {
        if (sendInvalidMessage == true || sendInvalidMessage == 'undefined' ) {
          sendInvalidMessage = false;
          return message.reply('youre already playing bozo, finish your current one').then((message) => {setTimeout(() => 
          message.delete(), 3000)}).then(() => {
            message.delete();
          }).then(() => {setTimeout(() => sendInvalidMessage = true, 2000)});
          }
        else {
          message.delete();
          return;
        };
       };

async function play(lives, score) {
  const roshambo = ['??', '🪨','📄','✂️',]
  playing = true;
    function mainEmbed() {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setColor('#242424')
        .setDescription('`Choose by reacting`')
        .addFields (
          {name: `${message.author.username} (you)`, value: `${roshambo[0]}`, inline: true},
          {name: '\u200B', value: '💥', inline: true},
          {name: `jinx (bot)`, value: `${roshambo[0]}`, inline: true},
        )
        .setFooter({text:`${prefix}roshambo`, iconURL: message.author.displayAvatarURL()})
        return embed;
    };

    let randomChoice = roshambo[Object.keys(roshambo)[Math.floor(Math.random() * (Object.keys(roshambo).length))]];
    console.log(randomChoice)

    let sentEmbed;
    message.channel.send({embeds: [mainEmbed()]}).then(sentMessage => {
      sentEmbed = sentMessage;
      sentMessage.react(roshambo[1]);
      sentMessage.react(roshambo[2]);
      sentMessage.react(roshambo[3]);
    })
    if (typeof sentEmbed !== 'undefined') {
      let filter = user => user.id === message.author.id
      sentEmbed.awaitReactions({ filter, max: 1, time: 10000})
     .then(collected => {
      console.log('collected:'+collected)
      const reaction = collected.first();
      console.log('reaction:'+reaction)
      let playerChoice = reaction == roshambo[1] ? 'rock' : reaction == roshambo[2] ? 'paper' : reaction == roshambo[3] ? 'scissors' : roshambo[0];
      if (playerChoice !== 'empty') {
        sentEmbed.edit({embeds: embed.addFields (
          {name: `${message.author.username} (you)`, value: `${playerChoice}`, inline: true},
          {name: '\u200B', value: '💥', inline: true},
          {name: `jinx (bot)`, value: `${randomChoice}`, inline: true},
        )})
       }
      })
    };
};
  play();
};
