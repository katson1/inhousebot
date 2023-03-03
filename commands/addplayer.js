const {SlashCommandBuilder} = require("discord.js");
const Player = require('../model/playermodel');


const sqlite3 = require('sqlite3').verbose();
//adicionando conexão com o sql
let db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectando na db em addplayer.js...');
});

const playersql = new Player('mydb.sqlite');

//createTable if dont exists
createTable(db);



const list = [{ name: 'Healer', value: 'Healer' },  { name: 'Bruiser', value: 'Bruiser' },  { name: 'Assassin ranged', value: 'Assassin ranged' },  { name: 'Assassin flex', value: 'Assassin flex' },  { name: 'Flex', value: 'Flex' },  { name: 'Tank', value: 'Tank' }];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addplayer")
        .setDescription("Adiciona um jogador!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Adicione o nome do jogador')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role1')
                .setDescription('Adicione a role primária')
                .setRequired(true)
                .addChoices(...list))
        .addStringOption(option =>
            option.setName('role2')
                .setDescription('Adicione a reole secundária')
                .setRequired(true)
                .addChoices(...list)),

    async execute(interaction){
        type = 1;
        
        //ADICIONAR CHECAGEM SE JOGADOR TEM CARGO PARA ADICIONAR OUTRO PLAYER
        //console.log(interaction.member.roles.cache.some(role => role.name === 'inhouse'));

        const user = interaction.user.username;
        const player = interaction.options.getUser('player').username;
        const tag = interaction.options.getUser('player').discriminator;
        const userTag = player+'#'+tag;
        const role1 = interaction.options.getString('role1');
        const role2 = interaction.options.getString('role2');

        const rows = await playersql.getPlayerByUsertag(userTag);
        console.log(rows);

        console.log("********************");
        let row;
        let sql = `SELECT * FROM player WHERE usertag = ?`;
        await new Promise((resolve, reject) => {
            db.all(sql, [userTag], (err, result) => {
                if (err) {
                    reject(err);
                }
                row = result;
                console.log(result);
                resolve();
                
                if (result.length > 0) {
                    exampleEmbed = getEmbed(2);
                    exampleEmbed.title = 'Atenção';
                    exampleEmbed.fields.push(   
                    {
                        name: `O jogador ${userTag} já está adicionado na inhouse!`,
                        value: `MMR atual: ${result[0].mmr} - Foi adicionado por: ${result[0].addby}`,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false,
                    });
                    interaction.reply({ embeds: [exampleEmbed]});    


                } else {
                    console.log(`O jogador ${userTag} não existe.`);
                    let sql = `INSERT INTO users (usertag, name, mmr, role1, role2, addby, win, lose) VALUES (?,?,?,?,?,?,?,?)`;
                    let values = [userTag, player, 100, role1, role2, user, 0, 0];
                    db.run(sql, values, function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log(`A row has been inserted with rowid ${this.lastID}`);
                    });

                    exampleEmbed = getEmbed(1);
                    exampleEmbed.author.name = `${user} adicionou um novo jogador:`;
                    if(role1 == role2){
                        exampleEmbed.title = userTag;
                        exampleEmbed.fields.push({
                            name: `A role de ${player} é apenas:`,
                            value: role1,
                            inline: true,
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: false,
                        });
                        interaction.reply({ embeds: [exampleEmbed]});
                    } else {
                        exampleEmbed.title = userTag;
                        exampleEmbed.fields.push(
                        {
                            name: `As roles do ${player} são:`,
                            value: role1,
                            inline: true,
                        },
                        {
                            name: '\u200b',
                            value: role2,
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
            });
        });
    }
}

function getEmbed(type){
    //embed to reply interaction
    //type == 1 -> player inserted
    //type == 2 -> player already in the table
    if(type == 1){
        embed = {
            color: 0x000000,
            title: '',
            author: {
                name: ``,
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
            description: 'Seja bem-vindo à nossa inhouse.',
            fields: [
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Developed by KemmelAnos',
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
        };
    } else {
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
    }

    return embed;
}

function createTable(db){
    db.run(`
    CREATE TABLE IF NOT EXISTS player (
        usertag text PRIMARY KEY NOT NULL,
        name text NOT NULL,
        mmr int NOT NULL,
        role1 text NOT NULL,
        role2 text,
        addby text,
        win int,
        lose int,
        games int
    )`);
}
