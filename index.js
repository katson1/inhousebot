const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

//dotenv
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN } = process.env;

//sqlite
const sqlite3 = require('sqlite3').verbose();

//import commands
const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname,"commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for(const file of commandsFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command)
    } else {
        console.log(`Esse comando em ${filePath} está com data ou execute ausentes!`);
    }
}

// Login do bot
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

// Listener de interações com o bot
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error("Comando não encontrado");
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply("Houve um erro ao executar esse comando!");
    }
    //console.log(interaction);
});

client.on('message', message => {
    // Check if the message was sent by your boy
    if (message.author.id === '210789016675549184') {
      // Delete the message after a specified amount of time (in this case, 5 seconds)
      setTimeout(() => {
        message.delete();
      }, 5000);
    }
  });