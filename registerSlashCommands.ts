import { REST, Routes } from 'discord.js';
import commands from './commands';
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

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
