import { SlashCommandBuilder } from 'discord.js';
import Lobby from '../model/lobbymodel.js';
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Show a player's information!"),

    async execute(interaction) {

        const user = interaction.user.username;
        const tag = interaction.user.discriminator;
        const userTag = `${user}#${tag}`;

        // we get the lobby with the state 1 (opened)
        const result = await lobbysql.getLobbyOpenned();
        // if there is a lobby created with the command /lobby
        if (result.length > 0) {

            let players = result[0].players;
            let listplayers = JSON.parse(players);

            var replyEmbed = getEmbed();

            const isplayerincluded = await playersql.getPlayerByUsertag(userTag);
            // if player was added to the inhouse with the command /addplayer
            if (isplayerincluded.length === 0) {

                replyEmbed.title = `You are not added to the inhouse!`;

                // adding to embed: the player that use the command
                replyEmbed.fields.push(
                    {
                        name: 'Use /addplayer to add yourself, or ask someone with the inhouse role to add you',
                        value: '\u200b',
                        inline: false,
                    });
                await interaction.reply({ embeds: [replyEmbed] });

            } else {
                // checking if the player is already in an opened lobby
                if (listplayers.includes(userTag)) {

                    replyEmbed.title = `You are already in an open lobby N ${result[0].rowid}!`;
                    await interaction.reply({ embeds: [replyEmbed] });

                } else {
                    await lobbysql.updatePlayers(result, userTag);
                    // if the players in the lobby has 9 players, that means the player using /join is the 10th
                    // then we will change the lobby state to in_progress
                    if (listplayers.length === 9) {
                        const stringWithoutBrackets = result[0].players.substring(1, result[0].players.length - 1);
                        const rows = await playersql.getPlayersListWithIn(stringWithoutBrackets, userTag);

                        let originalList = rows;
                        let minDiff = Infinity;
                        let bestPartition;

                        for (const partition of getPartitions(originalList)) {
                            const sumA = partition.reduce((acc, obj) => acc + obj.mmr, 0);
                            const sumB = originalList.reduce((acc, obj) => acc + obj.mmr, 0) - sumA;
                            const diff = Math.abs(sumA - sumB);
                            if (diff < minDiff) {
                                minDiff = diff;
                                bestPartition = [partition, originalList.filter((obj) => !partition.includes(obj))];
                            }
                        }

                        replyEmbed.title = `Lobby: (${result[0].rowid})`;
                        replyEmbed.fields.push(
                            {
                                name: `Team 1:`,
                                value: '\u200b',
                                inline: true,
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true,
                            },
                            {
                                name: 'Team 2:',
                                value: '\u200b',
                                inline: true,
                            });
                        for (const x of Array(5).keys()) {
                            replyEmbed.fields.push(
                                {
                                    name: bestPartition[0][x].name + ' (' + bestPartition[0][x].mmr + ')',
                                    value: '\u200b',
                                    inline: true,
                                },
                                {
                                    name: '\u200b',
                                    value: '\u200b',
                                    inline: true,
                                },
                                {
                                    name: bestPartition[1][x].name + ' (' + bestPartition[1][x].mmr + ')',
                                    value: '\u200b',
                                    inline: true,
                                });
                        }

                        await lobbysql.updateTeams(bestPartition[0], bestPartition[1], result[0].rowid);
                        await lobbysql.updateStateToInProgress(result);
                        await interaction.reply({ embeds: [replyEmbed] });


                    } else {
                        replyEmbed.title = `Players in lobby (${result[0].rowid}):`;

                        // adding to embed: the list of players already in the lobby, if the list isn't empty
                        if (listplayers.length > 0) {
                            listplayers.forEach(element => {
                                replyEmbed.fields.push(
                                    {
                                        name: '',
                                        value: element,
                                        inline: false,
                                    });
                            });
                        }
                        // adding to embed: the player that use the command
                        replyEmbed.fields.push(
                            {
                                name: ``,
                                value: userTag,
                                inline: false,
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            });
                        await interaction.reply({ embeds: [replyEmbed] });

                    }
                }
            }

        } else {
            replyEmbed = getEmbed();
            replyEmbed.title = `A player needs to create a lobby before joining:`;
            replyEmbed.fields.push({
                name: `Type /lobby to create a lobby.`,
                value: '',
                inline: true,
            },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                });
            await interaction.reply({ embeds: [replyEmbed] });
        }
    }
}


function* getPartitions(array) {
    for (let i = 0; i < 2 ** array.length; i++) {
        const partition = [];
        for (let j = 0; j < array.length; j++) {
            if (i & (2 ** j)) {
                partition.push(array[j]);
            }
        }
        if (partition.length === array.length / 2) {
            yield partition;
        }
    }
}
