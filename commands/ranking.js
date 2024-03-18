import { SlashCommandBuilder } from 'discord.js';
import Player from '../model/playermodel.js';
import { getEmbed } from '../utils/embed.js';

const playersql = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("ranking")
        .setDescription("Shows player rankings!")
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Select an option.')
                .setRequired(true)
                .addChoices(
                    { name: 'Top 10 MMR', value: 'top10' },
                    { name: 'Bottom 10 MMR', value: 'bot10' },
                    { name: 'Top 10 Wins', value: 'win10' },
                    { name: 'Top 10 Losses', value: 'lose10' })),

    async execute(interaction){
        const option = interaction.options.getString('option');
        let exampleEmbed = getEmbed();
        let arrayplayers = [];
        switch (option) {
            case 'top10':
                exampleEmbed.title = 'Top 10 players by MMR:';
                arrayplayers = await playersql.getPlayerByTopMMR();
                break;
            case 'bot10':
                exampleEmbed.title = 'Bottom 10 players by MMR:';
                arrayplayers = await playersql.getPlayerByBotMMR();
                break;
            case 'win10':
                exampleEmbed.title = 'Top 10 players by wins:';
                arrayplayers = await playersql.getPlayerByTopWins();
                break;
            case 'lose10':
                exampleEmbed.title = 'Top 10 players by losses:';
                arrayplayers = await playersql.getPlayerByTopLoses();
                break;
        }
        if (arrayplayers.length > 0) {
            arrayplayers.forEach((element, index) => {
              let valueText;
              if (option === 'win10') {
                valueText = `${index + 1} | **${element.win}** | **${element.name}**`;
              } else if (option === 'lose10') {
                valueText = `${index + 1} | **${element.lose}** | **${element.name}**`;
              } else {
                valueText = `${index + 1} | **${element.mmr}** | **${element.name}**`;
              }
              exampleEmbed.fields.push({
                name: '',
                value: valueText,
                inline: false,
              });
            });
        } else {
            exampleEmbed.fields.push({
              name: 'No players registered in the inhouse!',
              value: '',
              inline: false,
            });
        }
        interaction.reply({ embeds: [exampleEmbed]});
        
    }
}
