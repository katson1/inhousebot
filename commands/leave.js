const {SlashCommandBuilder} = require("discord.js");
const Lobby = require('../model/lobbymodel');
const Player = require('../model/playermodel');


const sqlite3 = require('sqlite3').verbose();

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

  
module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Sair de um lobby!"),

    async execute(interaction){
        
        const user = interaction.user.username;
        const tag = interaction.user.discriminator;
        const userTag = user + '#' + tag;
        //ADICIONAR CHECAGEM SE JOGADOR ESTÁ INCRITO NA INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        result = await lobbysql.getLobbyOpenned();
                
        //if the lobby is in state 1
        if (result.length > 0) {
            
            lobbysql.removePlayer(result, userTag);

            exampleEmbed = getEmbed();
            exampleEmbed.title = `${userTag} saiu do lobby N ${result[0].rowid}.`;
            //adding to embed: the player that use the command
            exampleEmbed.fields.push(   
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});    

        } else {
            exampleEmbed = getEmbed();
            exampleEmbed.title = `Você não está em um lobby, ou o lobby já está definido!`;
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



