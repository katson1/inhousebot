const {SlashCommandBuilder} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde com 'Pong!'")
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')),

        async execute(interaction) {
            const target = interaction.options.getString('input');
            const reply = await interaction.reply(`Pong! ${target}`);
            console.log(reply.id);
            try {
                console.log(reply.id);
                const fetchedReply = await interaction.channel.messages.fetch(reply.id);
                if (fetchedReply) {
                    await fetchedReply.delete();
                } else {
                    console.log('Message does not exist');
                }
            } catch (error) {
                if (error.code === 10008) { // Unknown Message error
                    console.error('Failed to delete message: message not found');
                } else {
                    console.error('Failed to delete message:', error);
                }
            }
        }                     
                
}