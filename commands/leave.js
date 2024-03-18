import { SlashCommandBuilder } from 'discord.js';
import Lobby from '../model/lobbymodel.js';
import { getEmbed } from "../utils/embed.js";

const lobbysql = new Lobby('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave a lobby!"),

    async execute(interaction){
        
        const user = interaction.user.username;
        const tag = interaction.user.discriminator;
        const userTag = `${user}#${tag}`;
        // ADD CHECK IF PLAYER IS SIGNED UP FOR INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const result = await lobbysql.getLobbyOpenned();
                
        // if the lobby is in state 1
        if (result.length > 0) {
            
            await lobbysql.removePlayer(result, userTag);

            const exampleEmbed = getEmbed();
            exampleEmbed.title = `${user} has left the lobby N ${result[0].rowid}.`;
            // adding to embed: the player that used the command
            exampleEmbed.fields.push(   
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});    

        } else {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = `You are not in a lobby, or the lobby has already been set!`;
            exampleEmbed.fields.push({
                name: ``,
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
