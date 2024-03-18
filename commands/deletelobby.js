import { SlashCommandBuilder } from "discord.js";
import Lobby from '../model/lobbymodel.js';
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";

const lobbysql = new Lobby('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
    .setName("deletelobby")
    .setDescription("Close an open or in-progress lobby!")
    .addStringOption(option =>
        option.setName('lobbynumber')
            .setDescription('Add the lobby number')
            .setRequired(true)),

        async execute(interaction) {
        
        const replyEmbed = getEmbed();

        // ADD CHECK IF PLAYER HAS ROLE TO ADD ANOTHER PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const lobbynumber = interaction.options.getString('lobbynumber');
        const user = interaction.user.username;
        
        const result = await lobbysql.getLobbyInProgressOrOpenned(lobbynumber);

        if (result.length > 0) {
            replyEmbed.title = 'Info:';
            replyEmbed.fields.push(   
            {
                name: `The lobby (${lobbynumber}) has been deleted!`,
                value: ``,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Deleted by: ${user}`,
                inline: false,
            });
            interaction.reply({ embeds: [replyEmbed]});
            lobbysql.deleteLobby(lobbynumber);

        } else {
            replyEmbed.title = `The lobby ${lobbynumber} does not exist or has already been closed!`;
            interaction.reply({ embeds: [replyEmbed]});
        }
    }
}
