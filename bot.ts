import { Client } from 'discord.js';
import { loadKeyedWeights, loadWeights } from './util/data';
import commandList, { serverCommands } from './commands';
import { servers } from './config';


const weights = Object.fromEntries(servers.map((id) => [id, {
    foWeights: loadWeights('first_ord_words', id),
    soWeights: loadWeights('second_ord_words', id),
    foKeyedWeights: loadKeyedWeights('first_ord_words', id),
    soKeyedWeights: loadKeyedWeights('second_ord_words', id)
}]))

export type ServerWeights = typeof weights[string];

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildPresences",
        "GuildMembers",
        "GuildMessageReactions",
        "MessageContent"
    ],
    // presence: { activities: [{ type: ActivityType.Watching, name: 'y\'all 🥰' }] },
    allowedMentions: { repliedUser: false }
});

const commands = Object.fromEntries(commandList.concat(serverCommands).map((c) => [c.data.name, c]))

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const raw = commands[interaction.commandName];
    if (!raw) return;

    const command = 'commands' in raw
        ? raw.commands[interaction.options.getSubcommand()]
        : raw
    if (!command) return;

    const d = weights[interaction.guildId!];
    await command.execute(interaction, d);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const raw = commands[interaction.commandName];
    if (!raw) return;

    const command = 'commands' in raw
        ? raw.commands[interaction.options.getSubcommand()]
        : raw
    if (!command?.autocomplete) return;

    const d = weights[interaction.guildId!];
    await command.autocomplete(interaction, d);
})

void client.login(process.env.TOKEN);
