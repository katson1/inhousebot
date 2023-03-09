const {SlashCommandBuilder} = require("discord.js");
const Lobby = require('../model/lobbymodel');
const Player = require('../model/playermodel');

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletelobby")
        .setDescription("Fechar lobby aberto ou em progresso!")
        .addStringOption(option =>
            option.setName('lobbynumber')
                .setDescription('Adicione o número do lobby')
                .setRequired(true)),


    async execute(interaction){
        
        var replyEmbed = getEmbed();

        //ADICIONAR CHECAGEM SE JOGADOR TEM CARGO PARA ADICIONAR OUTRO PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const lobbynumber = interaction.options.getString('lobbynumber');
        const user = interaction.user.username;
        
        result = await lobbysql.getLobbyInProgressOrOpenned(lobbynumber);

        if (result.length > 0) {
            replyEmbed.title = 'Info:';
            replyEmbed.fields.push(   
            {
                name: `O lobby (${lobbynumber}) foi deletado!`,
                value: ``,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Deletado por: ${user}`,
                inline: false,
            });
            interaction.reply({ embeds: [replyEmbed]});
            lobbysql.deleteLobby(lobbynumber);

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
        footer: {
            text: 'Developed by Katson',
            icon_url: 'https://i.imgur.com/AfFp7pu.png',
        },
    };

    return embed;
}