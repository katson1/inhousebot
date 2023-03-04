const {SlashCommandBuilder} = require("discord.js");
const Lobby = require('../model/lobbymodel');
const Player = require('../model/playermodel');
const sqlite3 = require('sqlite3').verbose();

const lobbysql = new Lobby('mydb.sqlite');
const playersql = new Player('mydb.sqlite');

//adding connection with sqlite
let db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectando na db em join.js...');
  });

  
module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Entrar em um lobby criado!"),

    async execute(interaction){
        
        const user = interaction.user.username;
        const tag = interaction.user.discriminator;
        const userTag = user + '#' + interaction.user.discriminator;
        //ADICIONAR CHECAGEM SE JOGADOR ESTÁ INCRITO NA INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));


        //we get the lobby with the state 1 (openned)
        const result = await lobbysql.getLobbyOpenned();
        //if has a lobby created with the command /lobby
        if (result.length > 0) {
            
            let players = result[0].players;
            let listplayers = JSON.parse(players);
            exampleEmbed = getEmbed();
            
            isplayerincluded = await playersql.getPlayerByUsertag(userTag);
            if(isplayerincluded.length == 0){
                exampleEmbed.title = `Você não está adicionado na inhouse!`;

                //adding to embed: the player that use the command
                exampleEmbed.fields.push(   
                {
                    name: 'Use /addplayer para se adicionar, ou peça para alguém com o cargo inhouse lhe adicionar',
                    value: '\u200b',
                    inline: false,
                });
                await interaction.reply({ embeds: [exampleEmbed]});    
            } else {
                //checking if the player is already in a openned lobby
                if (listplayers.includes(userTag)) {
                    exampleEmbed.title = `Você já está em um lobby aberto Nº(${result[0].rowid})!`;
                    await interaction.reply({ embeds: [exampleEmbed]});    

                } else {

                    // if the players in the lobby has 9 players that means the player using /join is the 10th
                    // them we will change the lobby state to in_progress
                    if(listplayers.length == 9){
                        const stringWithoutBrackets = result[0].players.substring(1, result[0].players.length - 1);
                        rows = await playersql.getPlayersListWithIn(stringWithoutBrackets, userTag);
                    
                        console.log(rows);
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

                        exampleEmbed.title = `Lobby: (${result[0].rowid})`;
                        exampleEmbed.fields.push(
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
                            exampleEmbed.fields.push(
                            {
                                name: bestPartition[0][x].name + ' (' + bestPartition[0][x].mmr+')',
                                value: '\u200b',
                                inline: true,
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true,
                            },
                            {
                                name: bestPartition[1][x].name + ' (' + bestPartition[1][x].mmr+')',
                                value: '\u200b',
                                inline: true,
                            });
                        }
                        updateTeams(bestPartition[0], bestPartition[1], result[0].rowid);
                        updateState(result);
                        await interaction.reply({ embeds: [exampleEmbed]});    
                        

                    } else {
                        exampleEmbed.title = `Jogadores no lobby (${result[0].rowid}):`;

                        // adding to embed: the list of players already in the lobby, if the list isnt empty
                        if(listplayers.length > 0){
                            listplayers.forEach(element => {
                                exampleEmbed.fields.push(   
                                    {
                                        name: '',
                                        value: element,
                                        inline: false,
                                    });
                            });
                        }
                        //adding to embed: the player that use the command
                        exampleEmbed.fields.push(   
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
                        await interaction.reply({ embeds: [exampleEmbed]});    
                        
                    }
                } 
            }



        } else {
            exampleEmbed = getEmbed();
            exampleEmbed.title = `Algum jogador precisa criar um lobby antes de entrar:`;
            exampleEmbed.fields.push({
                name: `Digite /lobby para criar no lobby.`,
                value: '',
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            });
            await interaction.reply({ embeds: [exampleEmbed]});
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
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Developed by KemmelAnos',
            icon_url: 'https://i.imgur.com/AfFp7pu.png',
        },
    };

    return embed;
}

function updatePlayers(values, newplayer) {
    let rowid = values[0].rowid;
    let existingPlayers = values[0].players; // Existing players
    let parsedPlayers = JSON.parse(existingPlayers); // Parse the existing players into a JavaScript array
    parsedPlayers.push(newplayer); // Add a new player to the array
    let newPlayers = JSON.stringify(parsedPlayers); // Encode the modified array back into a JSON string
    
    let sql = `UPDATE lobby SET players = ? where rowid = ?`;
    db.run(sql, [newPlayers, rowid], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`The lobby has been updated.`);
    });

}

function updateState(values){
    let rowid = values[0].rowid;
    let state = 2; // in_progress
    
    let sql = `UPDATE lobby SET state = ? where rowid = ?`;
    db.run(sql, [state, rowid], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`The lobby has been updated.`);
    });
}

function updateTeams(team1, team2, lobbyid) {
    let transformedTeam1 = JSON.stringify(team1.map(team => team.usertag));
    let transformedTeam2 = JSON.stringify(team2.map(team => team.usertag));
    
    let sql = `UPDATE lobby SET team1 = '${transformedTeam1}', team2 = '${transformedTeam2}' where rowid = ?`;
    db.run(sql, [lobbyid], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`The lobby has been updated. 240`);
    });
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

