const {SlashCommandBuilder} = require("discord.js");
const Player = require('../model/playermodel');

const playersql = new Player('mydb.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ranking")
        .setDescription("Mostra ranking de jogadores!")
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Selecione uma opção.')
                .setRequired(true)
                .addChoices(
                    { name: 'Top 10 MMR', value: 'top10' },
                    { name: 'Bot 10 MMR', value: 'bot10' },
                    { name: 'Top 10 Wins', value: 'win10' },
                    { name: 'Top 10 Loses', value: 'lose10' })),

    async execute(interaction){
        const option = interaction.options.getString('option');
        exampleEmbed = getEmbed();
        switch (option) {
            case 'top10':
                exampleEmbed.title = 'Top 10 jogadores por MMR:';
                arrayplayers = await playersql.getPlayerByTopMMR();
                break;
            case 'bot10':
                exampleEmbed.title = 'Bot 10 jogadores por MMR:';
                arrayplayers = await playersql.getPlayerByBotMMR();
                break;
            case 'win10':
                exampleEmbed.title = 'Top 10 jogadores por vitórias:';
                arrayplayers = await playersql.getPlayerByTopWins();
                break;
            case 'lose10':
                exampleEmbed.title = 'Top 10 jogadores por derrotas:';
                arrayplayers = await playersql.getPlayerByTopLoses();
                break;
        }
        if (arrayplayers.length > 0) {
            arrayplayers.forEach((element, index) => {
              let valueText;
              if (option === 'win10') {
                valueText = `${index} | **${element.win}** | **${element.name}**`;
              } else if (option === 'lose10') {
                valueText = `${index} | **${element.lose}** | **${element.name}**`;
              } else {
                valueText = `${index} | **${element.mmr}** | **${element.name}**`;
              }
              exampleEmbed.fields.push({
                name: '',
                value: valueText,
                inline: false,
              });
            });
        } else {
            exampleEmbed.fields.push({
              name: 'Não existe players cadastrados na inhouse!',
              value: '',
              inline: false,
            });
        }
        interaction.reply({ embeds: [exampleEmbed]});
        
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
            icon_url: 'https://i.postimg.cc/W47Gr3Zq/DALL-E-2023-03-24-09-55-32.png',
        },
    };

    return embed;
}