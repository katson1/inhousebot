import { SlashCommandBuilder } from 'discord.js';
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";

const playersql = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("playerinfo")
        .setDescription("Shows a player's information!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Player usertag')
                .setRequired(true)),

    async execute(interaction){
        const player = interaction.options.getUser('player').username;
        const tag = interaction.options.getUser('player').discriminator;
        const userTag = player+'#'+tag;

        const result = await playersql.getPlayerByUsertag(userTag);
                
        if (result.length > 0) {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = `${player}:`;
            exampleEmbed.fields.push(   
            {
                name: ``,
                value: `Current MMR: ${result[0].mmr}`,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Wins: ${result[0].win}` ,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Losses: ${result[0].lose}` ,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Games: ${result[0].games}` ,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Added by: ${result[0].addby}`,
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});    

        } else {
            const exampleEmbed = getEmbed();
            exampleEmbed.fields.push(   
            {
                name: `${userTag} is not registered in the inhouse:`,
                value: ``,
                inline: false,
            },
            {
                name: '\u200b',
                value: `You can use /addplayer to add the player.`,
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});
            
        }
    }
}
