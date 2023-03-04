const {SlashCommandBuilder} = require("discord.js");
const Lobby = require('../model/lobbymodel');
const sqlite3 = require('sqlite3').verbose();


const lobbysql = new Lobby('mydb.sqlite');

//createTable if dont exists
createTable();


module.exports = {
    data: new SlashCommandBuilder()
        .setName("lobby")
        .setDescription("Criar um lobby!"),

    async execute(interaction){
        //ADICIONAR CHECAGEM SE JOGADOR ESTÁ INCRITO NA INHOUSE
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const result = await lobbysql.getLobbyOpenned();

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
            lobbysql.createLobby();

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
function createTable(){

    let db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Conectando na db em lobby.js...');
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS lobby (
        players json NOT NULL,
        team1 json NOT NULL,
        team2 json NOT NULL,
        winner int,
        state int
    )`);
}
