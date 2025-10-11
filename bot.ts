import { Client } from 'discord.js';
import { predictFOFromWeights, predictSOFromWeights } from './util/predict';
import { loadKeyedWeights, loadWeights } from './util/data';


const foWeights = loadWeights('first_ord_words');
const soWeights = loadWeights('second_ord_words');

const foKeyedWeights = loadKeyedWeights('first_ord_words');
const soKeyedWeights = loadKeyedWeights('second_ord_words');

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

    const user = interaction.options.getUser('mimic');

    switch (interaction.commandName) {
        case 'markov':
            // If a user is supplied, use the keyed weights for that use instead
            if (user) {
                const fw = (await foKeyedWeights)[user.id];
                const sw = (await soKeyedWeights)[user.id];
                if (!fw || !sw)
                    return // TODO ...

                const init = predictFOFromWeights(fw)[0];
                const sTokens = predictSOFromWeights(sw, init);
                return interaction.reply({
                    content: sTokens.join(' '),
                    allowedMentions: { parse: [] }
                });
            }

            const init = predictFOFromWeights(await foWeights)[0];
            const sTokens = predictSOFromWeights(await soWeights, init);
            return interaction.reply({
                content: sTokens.join(' '),
                allowedMentions: { parse: [] }
            });

        case 'markov-fo':
            if (user) {
                const fw = (await foKeyedWeights)[user.id];
                if (!fw)
                    return // TODO ...

                const fTokens = predictFOFromWeights(fw);
                return interaction.reply({
                    content: fTokens.join(' '),
                    allowedMentions: { parse: [] }
                });
            }

            const fTokens = predictFOFromWeights(await foWeights);
            return interaction.reply({
                content: fTokens.join(' '),
                allowedMentions: { parse: [] }
            });
    }
});

void client.login(process.env.TOKEN);
