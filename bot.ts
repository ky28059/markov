import { Client } from 'discord.js';
import { predictFOFromWeights, predictSOFromWeights } from './util/predict';
import { loadWeights } from './util/data';


const foWeights = loadWeights('first_ord_words');
const soWeights = loadWeights('second_ord_words');

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
            const init = predictFOFromWeights(await foWeights)[0];
            const sTokens = predictSOFromWeights(await soWeights, init);
            return interaction.reply({
                content: sTokens.join(' '),
                allowedMentions: { parse: [] }
            });

        case 'markov-fo':
            const fTokens = predictFOFromWeights(await foWeights);
            return interaction.reply({
                content: fTokens.join(' '),
                allowedMentions: { parse: [] }
            });
    }
});

void client.login(process.env.TOKEN);
