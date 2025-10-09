import { Client } from 'discord.js';
import { predictFOFromWeights } from './util/predict';
import { loadWeights } from './util/data';


const weights = loadWeights('first_ord_words');

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

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'markov':
            const tokens = predictFOFromWeights(await weights);
            return interaction.reply({
                content: tokens.join(' '),
                allowedMentions: { parse: [] }
            });
    }
});

void client.login(process.env.TOKEN);
