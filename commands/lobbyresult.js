const {SlashCommandBuilder} = require("discord.js");

const sqlite3 = require('sqlite3').verbose();
//adicionando conexão com o sql
let db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectando na db em lobbyresult.js...');
  });

//db.run(`INSERT INTO users (id, name) VALUES (?, ?)`, [1, 'John Doe']);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lobbyresult")
        .setDescription("Adiciona um jogador!")
        .addStringOption(option =>
            option.setName('lobbynumber')
                .setDescription('Adicione a role primária')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('winnerteam')
                .setDescription('Time vencedor')
                .setRequired(true)),


    async execute(interaction){
        
        //ADICIONAR CHECAGEM SE JOGADOR TEM CARGO PARA ADICIONAR OUTRO PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const lobbynumber = interaction.options.getString('lobbynumber');
        const winnerteam = interaction.options.getString('winnerteam');
        
        let row;
        let sql = `SELECT * FROM lobby WHERE rowid = ? AND state = 2`;
        await new Promise((resolve, reject) => {
            db.all(sql, [lobbynumber], (err, result) => {
                if (err) {
                    reject(err);
                }
                row = result;
                resolve();
                
                if (result.length > 0) {
                    exampleEmbed = getEmbed();
                    exampleEmbed.title = 'Info:';
                    exampleEmbed.fields.push(   
                    {
                        name: `O lobby (${lobbynumber}) foi fechado!`,
                        value: ``,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false,
                    });
                    interaction.reply({ embeds: [exampleEmbed]});    
                    updateState(lobbynumber);
                    updateMMRs(lobbynumber, winnerteam);

                } else {
                    exampleEmbed = getEmbed();
                    exampleEmbed.title = `O lobby ${lobbynumber} não existe ou já foi fechado!`;
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

function updateState(lobbynumber){
    let rowid = lobbynumber;
    let state = 3; // in_progress
    
    let sql = `UPDATE lobby SET state = ? where rowid = ?`;
    db.run(sql, [state, rowid], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`The lobby has been updated.`);
    });
}

function updateMMRs(lobbynumber, winnerteam){
    let rowid = lobbynumber;
    let state = 3; // in_progress
    
    let sql = `UPDATE lobby SET state = ? where rowid = ?`;
    db.run(sql, [state, rowid], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`The lobby has been updated.`);
    });

    let sql2 = `SELECT * FROM lobby WHERE rowid = ?`;
    db.all(sql2, [lobbynumber], (err, result) => {
        if (err) {
            reject(err);
        }
        row = result;

        console.log(result);
        let team1 = result[0].team1;
        let team1List = JSON.parse(team1);
        let team2 = result[0].team2;
        let team2List = JSON.parse(team2);

        if(winnerteam == 2){
            team1ListforEach(element => {
                let sql = `UPDATE users SET lose = lose + 1, mmr = mmr - 10 WHERE usertag = ?`;
                db.run(sql, [element], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            });
            team2List.forEach(element => {
                let sql = `UPDATE users SET win = win + 1, mmr = mmr + 10 WHERE usertag = ?`;
                db.run(sql, [element], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            });
        }
        if(winnerteam == 1){
            team2List.forEach(element => {
                let sql = `UPDATE users SET lose = lose + 1, mmr = mmr - 10 WHERE usertag = ?`;
                db.run(sql, [element], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            });
            team1List.forEach(element => {
                let sql = `UPDATE users SET win = win + 1, mmr = mmr + 10 WHERE usertag = ?`;
                db.run(sql, [element], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            });
        }
    });

}
