import { Client } from 'discord.js';
import { predictFOFromWeights, predictSOFromWeights } from './util/predict';
import { loadKeyedWeights, loadWeights } from './util/data';


const m = {
    '511675552386777099': {
        foWeights: loadWeights('first_ord_words'),
        soWeights: loadWeights('second_ord_words'),
        foKeyedWeights: loadKeyedWeights('first_ord_words'),
        soKeyedWeights: loadKeyedWeights('second_ord_words')
    },
    '749361934515699722': {
        foWeights: loadWeights('first_ord_words_cpu'),
        soWeights: loadWeights('second_ord_words_cpu'),
        foKeyedWeights: loadKeyedWeights('first_ord_words_cpu'),
        soKeyedWeights: loadKeyedWeights('second_ord_words_cpu')
    }
}

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
    const d = m[interaction.guildId as keyof typeof m];

    switch (interaction.commandName) {
        case 'markov':
            // If a user is supplied, use the keyed weights for that use instead
            if (user) {
                const fw = (await d.foKeyedWeights)[user.id];
                const sw = (await d.soKeyedWeights)[user.id];
                if (!fw || !sw)
                    return // TODO ...

                const init = predictFOFromWeights(fw)[0];
                const sTokens = predictSOFromWeights(sw, init);
                return interaction.reply({
                    content: sTokens.join(' '),
                    allowedMentions: { parse: [] }
                });
            }

            const init = predictFOFromWeights(await d.foWeights)[0];
            const sTokens = predictSOFromWeights(await d.soWeights, init);
            return interaction.reply({
                content: sTokens.join(' '),
                allowedMentions: { parse: [] }
            });

        case 'markov-fo':
            if (user) {
                const fw = (await d.foKeyedWeights)[user.id];
                if (!fw)
                    return // TODO ...

                const fTokens = predictFOFromWeights(fw);
                return interaction.reply({
                    content: fTokens.join(' '),
                    allowedMentions: { parse: [] }
                });
            }

            const fTokens = predictFOFromWeights(await d.foWeights);
            return interaction.reply({
                content: fTokens.join(' '),
                allowedMentions: { parse: [] }
            });
    }
});

void client.login(process.env.TOKEN);
