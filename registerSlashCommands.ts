import { REST, Routes } from 'discord.js';
import commands from './commands';


const payload = commands.map(d => d.data.toJSON());

const clientId = '973385182566580344';
const rest = new REST().setToken(process.env.TOKEN!);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register server commands
        await rest.put(
            Routes.applicationGuildCommands(clientId, '511675552386777099'),
            { body: payload }
        );
        await rest.put(
            Routes.applicationGuildCommands(clientId, '749361934515699722'),
            { body: payload }
        );
        await rest.put(
            Routes.applicationGuildCommands(clientId, '1137980132880040029'),
            { body: payload }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
