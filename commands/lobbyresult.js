import { SlashCommandBuilder } from 'discord.js';
import Lobby from '../model/lobbymodel.js';
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("lobbyresult")
        .setDescription("Sets the lobby result!")
        .addStringOption(option =>
            option.setName('lobbynumber')
                .setDescription('Add the lobby number')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('winnerteam')
                .setDescription('Winning team')
                .setRequired(true)),


    async execute(interaction){
        
        const replyEmbed = getEmbed();

        //ADD CHECK IF PLAYER HAS ROLE TO ADD ANOTHER PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const lobbynumber = interaction.options.getString('lobbynumber');
        const winnerteam = interaction.options.getString('winnerteam');
        const user = interaction.user.username;
        
        const result = await lobbysql.getLobbyInProgress(lobbynumber);

        if (result.length > 0) {
            replyEmbed.title = 'Info:';
            replyEmbed.fields.push(   
            {
                name: `The lobby (${lobbynumber}) has been closed!`,
                value: ``,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Closed by: ${user} - Winning team: ${winnerteam}`,
                inline: false,
            });
            interaction.reply({ embeds: [replyEmbed]});
            await lobbysql.updateStateToClosed(lobbynumber);
            await lobbysql.updateWinner(winnerteam, lobbynumber);
            await updateMMRs(lobbynumber, winnerteam);

        } else {
            replyEmbed.title = `The lobby ${lobbynumber} does not exist or has already been closed!`;
            interaction.reply({ embeds: [replyEmbed]});

        }
    }
}

async function updateMMRs(lobbynumber, winnerteam){
    const rowid = lobbynumber;
    
    //lobbysql.updateStateToClosed(rowid);

    const result = await lobbysql.getLobbyByRowid(rowid);

    const team1 = result[0].team1;
    const team1List = JSON.parse(team1);
    const team2 = result[0].team2;
    const team2List = JSON.parse(team2);

    if(winnerteam == '2'){
        team1List.forEach(async element => {
            await playersql.updatePlayerLosses(element);
            await playersql.updatePlayerMmrLoss(element);
        });
        team2List.forEach(async element => {
            await playersql.updatePlayerWins(element);
            await playersql.updatePlayerMmrWin(element);
        });
    }
    if(winnerteam == '1'){
        team2List.forEach(async element => {
            await playersql.updatePlayerLosses(element);
            await playersql.updatePlayerMmrLoss(element);
        });
        team1List.forEach(async element => {
            await playersql.updatePlayerWins(element);
            await playersql.updatePlayerMmrWin(element);
        });
    }

}
