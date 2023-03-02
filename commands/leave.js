const {SlashCommandBuilder} = require("discord.js");

const sqlite3 = require('sqlite3').verbose();

//adding connection with sqlite
let db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectando na db em leave.js...');
  });

  
module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Sair de um lobby!"),

    async execute(interaction){
        
        const user = interaction.user.username;
        const tag = interaction.user.discriminator;
        const userTag = user + '#' + interaction.user.discriminator;
        //ADICIONAR CHECAGEM SE JOGADOR ESTÁ INCRITO NA INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        let row;
        let sql = `SELECT rowid, * FROM lobby where state not in (2,3) order by rowid desc`;
        //we get the lobby with the state 1 (openned)
        await new Promise((resolve, reject) => {
            db.all(sql, [], (err, result) => {
                if (err) {
                    reject(err);
                }
                row = result;
                resolve();
                
                //if the lobby is in state 1
                if (result.length > 0) {
                    
                    removePlayer(result, userTag);

                    let players = result[0].players;
                    let listplayers = JSON.parse(players);

                    exampleEmbed = getEmbed();

                    exampleEmbed.title = `${userTag} saiu do lobby (${result[0].rowid}).`;


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
            });
        });
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

// state will controll if a lobby 
// openned(1), in_progress(2) or closed(3)
function createTable(db){
    console.log('criando lobby');
    db.run(`
    CREATE TABLE IF NOT EXISTS lobby (
        players NOT NULL,
        team1 NOT NULL,
        team2 text NOT NULL,
        winner text,
        state int
    )`);
}

function removePlayer(values, newplayer) {
    let rowid = values[0].rowid;
    let existingPlayers = values[0].players; // Existing players
    let parsedPlayers = JSON.parse(existingPlayers); // Parse the existing players into a JavaScript array
    var index = parsedPlayers.indexOf(newplayer);
    if (index !== -1) {
        parsedPlayers.splice(index, 1);
    }
    let newPlayers = JSON.stringify(parsedPlayers); // Encode the modified array back into a JSON string
    
    let sql = `UPDATE lobby SET players = ? where rowid = ?`;
    db.run(sql, [newPlayers, rowid], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`The lobby has been updated.`);
    });

}



