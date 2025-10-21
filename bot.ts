import { Client } from 'discord.js';
import { loadKeyedWeights, loadWeights } from './util/data';
import commandList from './commands';


const servers = ['511675552386777099', '749361934515699722', '1137980132880040029'];

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

const commands = Object.fromEntries(commandList.map((c) => [c.data.name, c]))

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands[interaction.commandName];
    if (!command) return;

    const d = weights[interaction.guildId!];
    await command.execute(interaction, d);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const command = commands[interaction.commandName];
    if (!command?.autocomplete) return;

    const d = weights[interaction.guildId!];
    await command.autocomplete(interaction, d);
})

void client.login(process.env.TOKEN);
