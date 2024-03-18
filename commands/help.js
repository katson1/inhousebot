import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help about commands!"),

    async execute(interaction) {
        const exampleEmbed = getEmbed();
        console.log(interaction.member.roles);
        exampleEmbed.title = 'Commands:';
        exampleEmbed.fields.push(
            {
                name: `/addplayer`,
                value: `Adds a player to the inhouse. A player can only enter a lobby if they have been added. A player starts with 50 MMR points.`,
                inline: false,
            },
            {
                name: `/lobby`,
                value: `Opens a lobby if one does not already exist.`,
                inline: false,
            },
            {
                name: `/join`,
                value: `Joins an open lobby.`,
                inline: false,
            },
            {
                name: `/leave`,
                value: `Leaves a previously joined lobby, it's not possible to leave a lobby in progress (teams already set)!`,
                inline: false,
            },
            {
                name: `/lobbyresult`,
                value: `Closes a lobby and sets its result, each player on the winning team gains 5 MMR points, losers lose 5 MMR points.`,
                inline: false,
            },
            {
                name: `/playerinfo`,
                value: `Shows information about a player.`,
                inline: false,
            },
            {
                name: `/deletelobby`,
                value: `Deletes an open lobby (players joining) or in progress (teams set).`,
                inline: false,
            },
            {
                name: `/allplayers`,
                value: `Shows all users registered in the inhouse.`,
                inline: false,
            },
            {
                name: `/help`,
                value: `Shows the description of the commands.`,
                inline: false,
            },
            {
                name: ``,
                value: ``,
                inline: false,
            }
        );
        await interaction.reply({ embeds: [exampleEmbed] });
    }
};
