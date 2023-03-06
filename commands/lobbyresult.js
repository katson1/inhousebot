const {SlashCommandBuilder} = require("discord.js");
const Lobby = require('../model/lobbymodel');
const Player = require('../model/playermodel');

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lobbyresult")
        .setDescription("Adiciona um jogador!")
        .addStringOption(option =>
            option.setName('lobbynumber')
                .setDescription('Adicione a role primária')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('winnerteam')
                .setDescription('Time vencedor')
                .setRequired(true)),


    async execute(interaction){
        
        var replyEmbed = getEmbed();

        //ADICIONAR CHECAGEM SE JOGADOR TEM CARGO PARA ADICIONAR OUTRO PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const lobbynumber = interaction.options.getString('lobbynumber');
        const winnerteam = interaction.options.getString('winnerteam');
        const user = interaction.user.username;
        
        result = await lobbysql.getLobbyInProgress(lobbynumber);

        if (result.length > 0) {
            replyEmbed.title = 'Info:';
            replyEmbed.fields.push(   
            {
                name: `O lobby (${lobbynumber}) foi fechado!`,
                value: ``,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Fechado por: ${user} - Time vencedor: ${winnerteam}`,
                inline: false,
            });
            interaction.reply({ embeds: [replyEmbed]});
            lobbysql.updateStateToClosed(lobbynumber);
            lobbysql.uptateWinner(winnerteam, lobbynumber);
            updateMMRs(lobbynumber, winnerteam);

        } else {
            replyEmbed.title = `O lobby ${lobbynumber} não existe ou já foi fechado!`;
            interaction.reply({ embeds: [replyEmbed]});

        }
    }
}

function getEmbed(){

    embed = {
        color: 0x000000,
        title: '',
        description: '',
        fields: [
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Developed by Katson',
            icon_url: 'https://i.imgur.com/AfFp7pu.png',
        },
    };

    return embed;
}

async function updateMMRs(lobbynumber, winnerteam){
    let rowid = lobbynumber;
    
    //lobbysql.updateStateToClosed(rowid);

    result = await lobbysql.getLobbyByRowid(rowid);

    let team1 = result[0].team1;
    let team1List = JSON.parse(team1);
    let team2 = result[0].team2;
    let team2List = JSON.parse(team2);

    if(winnerteam == 2){
        team1List.forEach(element => {
            playersql.updatePlayerLoses(element);
            playersql.updatePlayerMmrLose(element);
        });
        team2List.forEach(element => {
            playersql.updatePlayerWins(element);
            playersql.updatePlayerMmrWin(element);
        });
    }
    if(winnerteam == 1){
        team2List.forEach(element => {
            playersql.updatePlayerLoses(element);
            playersql.updatePlayerMmrLose(element);
        });
        team1List.forEach(element => {
            playersql.updatePlayerWins(element);
            playersql.updatePlayerMmrWin(element);
        });
    }

}
