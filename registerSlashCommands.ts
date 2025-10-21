import { REST, Routes, SlashCommandBuilder } from 'discord.js';


const commands = [
    new SlashCommandBuilder()
        .setName('markov')
        .setDescription('Generate some second-order Markov babble.')
        .addUserOption(option => option
            .setName('mimic')
            .setDescription('The user to mimic')
            .setRequired(false))
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to start prediction with.')
            .setRequired(false))
        .toJSON(),
    new SlashCommandBuilder()
        .setName('markov-fo')
        .setDescription('Generate some first-order Markov babble.')
        .addUserOption(option => option
            .setName('mimic')
            .setDescription('The user to mimic')
            .setRequired(false))
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to start prediction with.')
            .setRequired(false))
        .toJSON(),
    new SlashCommandBuilder()
        .setName('markov-weights')
        .setDescription('Sends the trained Markov chain weights for the given token.')
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to inspect weights for.')
            .setRequired(false))
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
        await rest.put(
            Routes.applicationGuildCommands(clientId, '749361934515699722'),
            { body: commands }
        );
        await rest.put(
            Routes.applicationGuildCommands(clientId, '1137980132880040029'),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
