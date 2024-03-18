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
            value: `Sai de um lobby entrado anteriormente, não é possível sair de um lobby em progresso (times já definidos)!`,
            inline: false,
        },
        {
            name: `/lobbyresult`,
            value: `Fecha um lobby e define seu resultado, cada jogador do time vencedor ganha 5 pontos de MMR, perdedores perdem 5 pontos de MMR.`,
            inline: false,
        },
        {
            name: `/playerinfo`,
            value: `Mostra informações sobre um jogador.`,
            inline: false,
        },
        {
            name: `/deletelobby`,
            value: `Deleta um lobby aberto (jogadores entrando) ou em progresso (times definidos).`,
            inline: false,
        },
        {
            name: `/allplayers`,
            value: `Mostra todos os usuários registrados na inhouse.`,
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
            icon_url: 'https://i.postimg.cc/W47Gr3Zq/DALL-E-2023-03-24-09-55-32.png',
        },
    };

    return embed;
}

