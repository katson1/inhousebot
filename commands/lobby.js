const {SlashCommandBuilder} = require("discord.js");

const sqlite3 = require('sqlite3').verbose();
//adicionando conexão com o sql
let db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectando na db em lobby.js...');
  });

//createTable if dont exists
createTable(db);

//db.run(`INSERT INTO users (id, name) VALUES (?, ?)`, [1, 'John Doe']);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lobby")
        .setDescription("Criar um lobby!"),

    async execute(interaction){
        type = 1;
        
        //ADICIONAR CHECAGEM SE JOGADOR ESTÁ INCRITO NA INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        let row;
        let sql = `SELECT rowid, * FROM lobby where state not in (2,3) order by rowid desc`;
        await new Promise((resolve, reject) => {
            db.all(sql, [], (err, result) => {
                if (err) {
                    reject(err);
                }
                row = result;
                console.log(result);
                resolve();
                
                if (result.length > 0) {
                    exampleEmbed = getEmbed();
                    exampleEmbed.title = 'Lobby:';
                    exampleEmbed.fields.push(   
                    {
                        name: `Existe um lobby em aberto à espera de jogadores.`,
                        value: `Digite /join para entrar no lobby!`,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false,
                    });
                    interaction.reply({ embeds: [exampleEmbed]});    


                } else {
                    let sql = `INSERT INTO lobby (players, team1, team2, winner, state) VALUES (?,?,?,?,?)`;
                    let values = ['[]', '[]', '[]', 0, 1];
                    db.run(sql, values, function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log(`A row has been inserted with rowid ${this.lastID}`);
                    });

                    exampleEmbed = getEmbed();
                    exampleEmbed.title = `Um lobby foi criado:`;
                    exampleEmbed.fields.push({
                        name: `Jogadores, digite /join para entrar no lobby.`,
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
// is open(1), in_progress(2) or closed(3)
function createTable(db){
    db.run(`
    CREATE TABLE IF NOT EXISTS lobby (
        players json NOT NULL,
        team1 json NOT NULL,
        team2 json NOT NULL,
        winner int,
        state int
    )`);
}
