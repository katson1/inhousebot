const {SlashCommandBuilder} = require("discord.js");
const Player = require('../model/playermodel');

const playersql = new Player('mydb.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("allplayers")
        .setDescription("Mostra todos os jogadores!"),

    async execute(interaction){
        exampleEmbed = getEmbed();
        arrayplayers = await playersql.getPlayers();
        if (arrayplayers.length > 0) {
            arrayplayers.forEach((element) => {
              const valueText = `**${element.name}** | **${element.usertag}**`
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