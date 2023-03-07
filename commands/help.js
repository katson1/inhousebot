const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Ajuda sobre comandos!"),

    async execute(interaction){

        exampleEmbed = getEmbed();
        exampleEmbed.title = 'Comandos:';
        exampleEmbed.fields.push(   
        {
            name: `/addplayer`,
            value: `Adiciona um jogador à inhouse. Um jogador só pode entrar em um lobby se estiver adicionado. Um jogador começa com 50 pontos de MMR.`,
            inline: false,
        },
        {
            name: `/lobby`,
            value: `Abre um lobby se não já existir um aberto.`,
            inline: false,
        },
        {
            name: `/join`,
            value: `Entra em um lobby aberto.`,
            inline: false,
        },
        {
            name: `/leave`,
            value: `Sair de um lobby entrado anteriormente, não é possível sair de um lobby em progresso (times já definidos)!`,
            inline: false,
        },
        {
            name: `/lobbyresult`,
            value: `Fecha um lobby e define seu resultado, cada jogador do time vencedor ganha 5 pontos de MMR, perdedores perder 5 pontos de MMR.`,
            inline: false,
        },
        {
            name: `/playerinfo`,
            value: `Mostra informações sobre um jogador.`,
            inline: false,
        },
        {
            name: `/help`,
            value: `Mostra a descrição dos comandos.`,
            inline: false,
        },
        {
            name: ``,
            value: ``,
            inline: false,
        });
        interaction.reply({ embeds: [exampleEmbed]});    


    }
}


function getEmbed(){

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

