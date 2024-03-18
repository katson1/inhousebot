import { REST, Routes } from "discord.js";
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const { TOKEN, CLIENT_ID } = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const commands = [];

for (const file of commandsFiles) {
    const filePath = `./commands/${file}`;
    const commandModule = await import(filePath);
    commands.push(commandModule.default.data.toJSON());
}

// REST instance
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Deploy
(async () => {
    try {
        console.log(`Restarting ${commands.length} commands...`);

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log("Commands registered successfully!");

    } catch (error) {
        console.error(error);
    }
})();
