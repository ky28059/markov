import { REST, Routes, SlashCommandBuilder } from 'discord.js';


const commands = [
    new SlashCommandBuilder()
        .setName('markov')
        .setDescription('Generate some second-order Markov babble.')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('markov-fo')
        .setDescription('Generate some first-order Markov babble.')
        .toJSON()
]

const clientId = '973385182566580344';
const rest = new REST().setToken(process.env.TOKEN!);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register server commands
        await rest.put(
            Routes.applicationGuildCommands(clientId, '511675552386777099'),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
