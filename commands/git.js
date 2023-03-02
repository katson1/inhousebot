const {SlashCommandBuilder,  EmbedBuilder} = require("discord.js");

// inside a command, event listener, etc.
const exampleEmbed = new EmbedBuilder()
	.setColor("Black")
	.setTitle('Teste Draft')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here'},
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Criado pelo KemmelAnos', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("Relembrar comandos do Git"),

    async execute(interaction){
        await interaction.reply({ embeds: [exampleEmbed] });
    }
}