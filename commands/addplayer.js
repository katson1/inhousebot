import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { createTablePlayer } from '../database/db.js';
import { getEmbed } from "../utils/embed.js";


const playersql = new Player('mydb.sqlite');

// Create table if it doesn't exist
createTablePlayer();

export default {
    data: new SlashCommandBuilder()
    .setName("addplayer")
    .setDescription("Add a player!")
    .addUserOption(option =>
        option.setName('player')
            .setDescription('Add the player’s name')
            .setRequired(true)),

        async execute(interaction) {
        // ADD CHECK IF PLAYER HAS ROLE TO ADD ANOTHER PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const user = interaction.user.username;
        const player = interaction.options.getUser('player').username;
        const tag = interaction.options.getUser('player').discriminator;
        const userTag = `${player}#${tag}`;
        const result = await playersql.getPlayerByUsertag(userTag);

        if (result.length > 0) {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = 'Attention';
            exampleEmbed.fields.push(   
            {
                name: `The player ${user} is already added to the inhouse!`,
                value: `Current MMR: ${result[0].mmr} - Added by: ${result[0].addby}`,
                inline: false,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            });
            await interaction.reply({ embeds: [exampleEmbed]});    


        } else {
            const data = await playersql.createPlayer(userTag, player, user);
            const exampleEmbed = getEmbed();
            exampleEmbed.title = `${user},`;
            exampleEmbed.fields.push(   
            {
                name: `**WELCOME!**`,
                value: `Good luck, have fun`,
                inline: false,
            });
            await interaction.reply({ embeds: [exampleEmbed]});    
        }
    }
}
