const Discord = require("discord.js");
let playing = false;
let lostReason;
let sendInvalidMessage = true;
let previousQuestion;
let previousAnswer;
let exportedScore = 0;

module.exports.run = (prefix, client, message, args) => {
  let messageWithEmbed;
  if (args[0] !== 'stop') {
   if (playing == true) {
    if (sendInvalidMessage == true) {
      sendInvalidMessage = false;
      return message.reply('youre already playing bozo, finish your current one').then((message) => {setTimeout(() => 
      message.delete(), 3000)}).then(() => {
        message.delete();
      }).then(() => {setTimeout(() => sendInvalidMessage = true, 2000)});
      }
    else return message.delete();
   };
  }

  async function play(lives, score) {
    
    if (args == 'stop' || lives < 1) {
      if (playing == false) {
        return message.reply("you can't stop a game that doesnt exist")
        .then(message => setTimeout(() => {message.delete()}, 3000));
      };
      playing = false;
      let reason;
      if (lives < 1) reason = `Player ran out of lives. (${lostReason})`
      else {reason = 'Game ended by command.'};
      const resultsCommentText = score >= 30 ? {title:'AWESOME!!!', text: 'you are a human calculator!'} : score >=20 ? {title:'Good!', text:'you could do better.'} : score >= 10 ? {title:'ok..', text:'not bad and not good.'}: {title:'TERRIBLE!!', text:'how can you be this bad at basic maths!?'};
      const resultsCommentEmoji = score >= 30 ? '🤩' : score >= 20 ? '🙂' : score >= 10 ? '😐' : '🥹';
      const difficultyEmoji = difficulty == `Hard` ? '🥇' : difficulty == 'Intermediate' ? '🥈' : '🥉';
      const resultsEmbed = new Discord.EmbedBuilder()
      .setColor('#242424')
      .setAuthor({name: message.author.tag})
      .setTitle(`RESULTS`)
      .setDescription(`${reason}\n` + '`' + `${previousQuestion} = ${previousAnswer}` + '`')
      .addFields(
        { name: '🔺 | Difficulty', value: '`' + `${difficulty}` + '`' + ' ' + `${difficultyEmoji}`, inline: false },
        { name: '⭐ | Score', value: '`' + `${exportedScore}` + '`', inline: false },
        { name:`${resultsCommentEmoji} ${resultsCommentText.title}`, value: `${resultsCommentText.text}`}
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter({text: `${prefix}math`, iconURL: message.author.displayAvatarURL()})
      let messageWithEmbed = await message.channel.messages.fetch({limit: 10}).then
      (messages => messages.find(m => m.embeds.length > 0));
      await messageWithEmbed.edit({embeds:[resultsEmbed]})
      return messageWithEmbed = void 0;
    }

    function generateQuestion(score) {
      let a;
      let b;
      let c;
      let question;
      let answer;
      let operators= ['+', '-', '*']
      let operator = operators[Math.floor(Math.random() * operators.length)];
        const difficultyColors = { 
            'Easy': color = '#4fceec',
            'Intermediate': color = '#f7ec5c',
            'Hard': color = '#ff7569'
           };
          difficulty = score >= 20 ? 'Hard' : score >= 10 ? 'Intermediate' : 'Easy';
          difficultyColor = difficultyColors[difficulty];
    if (difficulty == 'Easy') {
      minimum = operator == '*' ? 2 : 1;
      maximum = operator == '*' ? 10 : 15;
    }
    else if (difficulty == 'Intermediate') {
      minimum = operator == '*' ? 5 : 10;
      maximum = operator == '*' ? 12 : 40;
    }
    else if (difficulty == 'Hard') {
      minimum = operator || secondOperator == '*' ? 5 : 25;
      maximum = operator || secondOperator == '*' ? 12 : 50;
    };  
    a = Math.ceil(Math.random() * (maximum - minimum + 1)) + minimum;
    b = Math.ceil(Math.random() * (maximum - minimum + 1)) + minimum;
    if (difficulty === 'Hard') {
    c = Math.ceil(Math.random() * (maximum - minimum + 1)) + minimum;
    let secondOperator = operators[Math.floor(Math.random() * operators.length)];
    if (secondOperator == operator) {
      while (secondOperator == operator) {
        secondOperator = operators[Math.floor(Math.random() * operators.length)];
      }
    };
    const useParentheses = Math.random() < 0.5; 
     if (useParentheses) {
     question = `(${a} ${operator} ${b}) ${secondOperator} ${c}`;} 
     else {
     question = `${a} ${operator} (${b} ${secondOperator} ${c})`;
     }
     let answer = eval(question);
     return {question, answer};
    };
    question = `${a} ${operator} ${b}`; 
    answer = eval(question);
    return {question, answer};
    };

    ({question, answer} = generateQuestion(score))
    console.log(`${question} = ${answer}`)

    playing = true;
    let livesString =  '❤️'.repeat(lives);
    let time = '🕛';
    let timeLeft = 15;
    const clockArray = ['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕘','🕙','🕚','🕛','🕛'].reverse();
    const timeInterval = setInterval(() => {
      timeLeft--;
      time = clockArray[timeLeft];
    }, 1000);
    
    let editTimeEmbedInterval = timeLeft >= 10 ? 2000 : 3000;
    const editTimeEmbed = setInterval(() => {
      if (typeof messageWithEmbed !== 'undefined' && playing === true) {
       messageWithEmbed.edit({embeds:[embed.setTitle(`${time}  |  ${difficulty}`)]})
      }
      else clearInterval(editTimeEmbed);
    }, editTimeEmbedInterval);

    const embed = new Discord.EmbedBuilder()
    .setColor(`${difficultyColor}`)
    .setTitle(`${time}  |  ${difficulty}`)
    .setDescription(`${question}`)
    .addFields (
      { name: 'Lives', value: `${livesString}`, inline: true},
      { name: '⭐ | Score', value: `${score}`, inline: true}
    )
    .setFooter({text: `${prefix}math`, iconURL: message.author.displayAvatarURL()})
    previousQuestion = question;
    previousAnswer = answer;

    if (typeof messageWithEmbed !== 'undefined') {
      messageWithEmbed.edit({embeds:[embed]});
    } else {
      message.channel.send({embeds:[embed]}).then(sentMessage => {
      messageWithEmbed = sentMessage;
      })
    };

    const filter = m => m.author.id === message.author.id && Number(m.content) || (m.content === '0') || (m.content === `${prefix}math stop`);
    const collector = message.channel.createMessageCollector({filter, max: 1, time: 15000});
    collector.on('collect', message => {
        const response = message.content;
        if (response === `${prefix}math stop`) return;
         if (response == answer) {
         clearInterval(timeInterval);
         clearInterval(editTimeEmbed);
         score++;
         messageWithEmbed.edit({embeds:[embed.setColor('#32CD32').setTitle('CORRECT')]})
         message.delete()
         exportedScore = score;
         return play(lives, score);
         
         }
        else {
         clearInterval(timeInterval);
         clearInterval(editTimeEmbed);
         lostReason = 'incorrect answer';
         messageWithEmbed.edit({embeds:[embed.setColor('#f44336').setTitle('INCORRECT')]});
         message.delete()
         lives--;
         exportedScore = score;
         return play(lives, score);
            };
        });  

    collector.on('end', (collected, reason) => {
      if (message.content === `${prefix}math stop`) return;
      if (collected == 'time' || reason == 'time') {
        clearInterval(timeInterval);
        clearInterval(editTimeEmbed);
        lostReason = 'ran out of time';
        lives--;
        message.reply('youre too slow').then(sentMessage => {setTimeout(() => {sentMessage.delete()}, 1000);});
        exportedScore = score;
        return play(lives, score);
    };
    });
};
    play(3, 0);
};
