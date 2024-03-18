import { SlashCommandBuilder } from 'discord.js';
import Lobby from '../model/lobbymodel.js';
import { createTableLobby } from '../database/db.js';
import { getEmbed } from "../utils/embed.js";

const lobbysql = new Lobby('mydb.sqlite');

// Create table if it doesn't exist
createTableLobby();

export default {
    data: new SlashCommandBuilder()
        .setName("lobby")
        .setDescription("Create a lobby!"),

    async execute(interaction){
        // ADD CHECK IF PLAYER IS SIGNED UP FOR INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const result = await lobbysql.getLobbyOpenned();

        if (result.length > 0) {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = 'Lobby:';
            exampleEmbed.fields.push(   
            {
                name: `There is an open lobby waiting for players.`,
                value: `Type /join to enter the lobby!`,
                inline: false,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});    

        } else {
            lobbysql.createLobby();

            const exampleEmbed = getEmbed();
            exampleEmbed.title = `A lobby has been created:`;
            exampleEmbed.fields.push({
                name: `Players, type /join to enter the lobby.`,
                value: '',
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});
        }
    }
}
