const {SlashCommandBuilder} = require("discord.js");
const Player = require('../model/playermodel');

const playersql = new Player('mydb.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playerinfo")
        .setDescription("Mostra informações de um jogador!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Usertag do jogador')
                .setRequired(true)),

    async execute(interaction){
        type = 1;
        
        const player = interaction.options.getUser('player').username;
        const tag = interaction.options.getUser('player').discriminator;
        const userTag = player+'#'+tag;

        result = await playersql.getPlayerByUsertag(userTag);
                
        if (result.length > 0) {
            exampleEmbed = getEmbed();
            exampleEmbed.title = `${userTag}:`;
            exampleEmbed.fields.push(   
            {
                name: ``,
                value: `MMR atual: ${result[0].mmr}`,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Wins: ${result[0].win}` ,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Loses: ${result[0].lose}` ,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Games: ${result[0].games}` ,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Add by: ${result[0].addby}`,
                inline: false,
            });
            interaction.reply({ embeds: [exampleEmbed]});    

        } else {
            exampleEmbed = getEmbed();
            exampleEmbed.fields.push(   
            {
                name: `${userTag} não está inscrito na inhouse:`,
                value: ``,
                inline: false,
            },
            {
                name: '\u200b',
                value: `Você pode usar /addplayer para adicionar o jogador.`,
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