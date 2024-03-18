import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

dotenv.config();

const { TOKEN } = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for(const file of commandsFiles){
    const filePath = `./commands/${file}`;
    const commandModule = await import(filePath);
    const command = commandModule.default;
    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command)
    } else {
        console.log(`This command in ${filePath} is missing either date or execute!`);
    }
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
        await interaction.reply("There was an error executing this command!");
    }
});
