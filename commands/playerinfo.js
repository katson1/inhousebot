const {SlashCommandBuilder} = require("discord.js");

const sqlite3 = require('sqlite3').verbose();
//adicionando conexão com o sql
let db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectando na db em playerinfo.js...');
});


module.exports = {
    data: new SlashCommandBuilder()
        .setName("playerinfo")
        .setDescription("Procure informações de um jogador!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Nome do jogador')
                .setRequired(true)),

    async execute(interaction){
        type = 1;
        
        const player = interaction.options.getUser('player').username;
        const tag = interaction.options.getUser('player').discriminator;
        const userTag = player+'#'+tag;

        let row;
        let sql = `SELECT rowid, * FROM users WHERE usertag = ?`;
        await new Promise((resolve, reject) => {
            db.all(sql, [userTag], (err, result) => {
                if (err) {
                    reject(err);
                }
                row = result;
                console.log(result);
                resolve();
                
                if (result.length > 0) {
                    exampleEmbed = getEmbed();
                    exampleEmbed.title = `${userTag}:`;
                    exampleEmbed.fields.push(   
                    {
                        name: ``,
                        value: `MMR atual: ${result[0].mmr}`,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: `Wins: ${result[0].win}` ,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: `Loses: ${result[0].lose}` ,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: `Foi adicionado por: ${result[0].addby}`,
                        inline: false,
                    });
                    interaction.reply({ embeds: [exampleEmbed]});    

                } else {
                    exampleEmbed = getEmbed();
                    exampleEmbed.fields.push(   
                    {
                        name: `${userTag} não está inscrito na inhouse:`,
                        value: ``,
                        inline: false,
                    },
                    {
                        name: '\u200b',
                        value: `Você pode usar /addplayer para adicionar o jogador.`,
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