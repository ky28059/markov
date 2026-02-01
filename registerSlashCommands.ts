import { REST, Routes } from 'discord.js';
import commands, { serverCommands } from './commands';
import { servers } from './config';


const payload = commands.map(d => d.data.toJSON());

const clientId = '973385182566580344';
const rest = new REST().setToken(process.env.TOKEN!);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register server commands
        for (const id of servers) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, id),
                { body: payload }
            );
        }

        await rest.put(
            Routes.applicationGuildCommands(clientId, '511675552386777099'),
            { body: serverCommands.map(d => d.data.toJSON()) }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
