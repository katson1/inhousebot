const { SlashCommandBuilder } = require("discord.js");
const Lobby = require('../model/lobbymodel');
const Player = require('../model/playermodel');

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Mostrar informações de um jogador!"),

    async execute(interaction) {

        const user = interaction.user.username;
        const tag = interaction.user.discriminator;
        const userTag = user + '#' + tag;

        //we get the lobby with the state 1 (openned)
        const result = await lobbysql.getLobbyOpenned();
        //if has a lobby created with the command /lobby
        if (result.length > 0) {

            let players = result[0].players;
            let listplayers = JSON.parse(players);

            var replyEmbed = getEmbed();

            isplayerincluded = await playersql.getPlayerByUsertag(userTag);
            //if player was added to the inhouse with the command /addplayer
            if (isplayerincluded.length == 0) {

                replyEmbed.title = `Você não está adicionado na inhouse!`;

                //adding to embed: the player that use the command
                replyEmbed.fields.push(
                    {
                        name: 'Use /addplayer para se adicionar, ou peça para alguém com o cargo inhouse lhe adicionar',
                        value: '\u200b',
                        inline: false,
                    });
                await interaction.reply({ embeds: [replyEmbed] });

            } else {
                //checking if the player is already in a openned lobby
                if (listplayers.includes(userTag)) {

                    replyEmbed.title = `Você já está em um lobby aberto N ${result[0].rowid}!`;
                    await interaction.reply({ embeds: [replyEmbed] });

                } else {
                    lobbysql.updatePlayers(result, userTag);
                    // if the players in the lobby has 9 players that means the player using /join is the 10th
                    // them we will change the lobby state to in_progress
                    if (listplayers.length == 9) {
                        const stringWithoutBrackets = result[0].players.substring(1, result[0].players.length - 1);
                        rows = await playersql.getPlayersListWithIn(stringWithoutBrackets, userTag);

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
                                name: `Time 1:`,
                                value: '\u200b',
                                inline: true,
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true,
                            },
                            {
                                name: 'Time2:',
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

                        lobbysql.updateTeams(bestPartition[0], bestPartition[1], result[0].rowid);
                        lobbysql.updateStateToInProgress(result);
                        await interaction.reply({ embeds: [replyEmbed] });


                    } else {
                        replyEmbed.title = `Jogadores no lobby (${result[0].rowid}):`;

                        // adding to embed: the list of players already in the lobby, if the list isnt empty
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
                        //adding to embed: the player that use the command
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
            replyEmbed.title = `Algum jogador precisa criar um lobby antes de entrar:`;
            replyEmbed.fields.push({
                name: `Digite /lobby para criar no lobby.`,
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


function getEmbed() {

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

