const Discord = require("discord.js");
const openai = require("openai");
const fs = require("fs")
const client = new Discord.Client({intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"]});
const {token} = require('./config.json')
const {prefix} = require('./config.json')
//commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./jinx bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commandName = file.slice(0, -3); 
    const command = require(`./commands/${commandName}`)
    client.commands.set(commandName, command)
};
//ready message
client.on("ready", () => {
    console.log(`Ready to work`);
});

client.on("messageCreate", message => {
  
    if (message.author.bot) return;
    console.log(`<${message.author.tag}> ${message.content}`);

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(1).trim().split(' ')
        const commandName = args.shift()
        const command = client.commands.get(commandName);
        if (!command) return message.reply('that command doesnt exist');
        command.run(prefix, client, message, args)
    };

});
  
client.login(token);
