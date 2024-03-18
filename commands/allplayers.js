import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";

const playersql = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
    .setName("allplayers")
    .setDescription("Show all players!"),
        async execute(interaction) {
        const exampleEmbed = getEmbed();
        const arrayplayers = await playersql.getPlayers();
        if (arrayplayers.length > 0) {
            arrayplayers.forEach((element) => {
                const valueText = `**${element.name}**`
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
