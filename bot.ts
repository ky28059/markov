import { Client } from 'discord.js';
import { predictFOFromWeights, predictSOFromWeights } from './util/predict';
import { loadKeyedWeights, loadWeights } from './util/data';
import { EOF } from './util/train';
import { textEmbed } from './util/embeds';


const servers = ['511675552386777099', '749361934515699722', '1137980132880040029'];

const weights = Object.fromEntries(servers.map((id) => [id, {
    foWeights: loadWeights('first_ord_words', id),
    soWeights: loadWeights('second_ord_words', id),
    foKeyedWeights: loadKeyedWeights('first_ord_words', id),
    soKeyedWeights: loadKeyedWeights('second_ord_words', id)
}]))

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

    const d = weights[interaction.guildId!];

    switch (interaction.commandName) {
        case 'markov':
            const user = interaction.options.getUser('mimic');

            // If a user is supplied, use the keyed weights for that user instead
            if (user) {
                const fw = (await d.foKeyedWeights)[user.id];
                const sw = (await d.soKeyedWeights)[user.id];
                if (!fw || !sw) return interaction.reply({
                    embeds: [textEmbed(`No weights found for user ${user}.`)],
                    ephemeral: true
                });

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
            const fUser = interaction.options.getUser('mimic');
            if (fUser) {
                const fw = (await d.foKeyedWeights)[fUser.id];
                if (!fw) return interaction.reply({
                    embeds: [textEmbed(`No weights found for user ${fUser}.`)],
                    ephemeral: true
                });

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
