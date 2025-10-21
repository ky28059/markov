import { Client } from 'discord.js';
import { predictFOFromWeights, predictSOFromWeights } from './util/predict';
import { loadKeyedWeights, loadWeights } from './util/data';
import { EOF } from './util/train';
import { paginate, textEmbed } from './util/embeds';
import { chunked } from './util/misc';


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
            const sUser = interaction.options.getUser('mimic');
            const sInitial = interaction.options.getString('token');

            // If a user is supplied, use the keyed weights for that user instead
            const sfw = sUser
                ? (await d.foKeyedWeights)[sUser.id]
                : await d.foWeights;
            const sw = sUser
                ? (await d.soKeyedWeights)[sUser.id]
                : await d.soWeights;

            // TODO?
            if (!sfw || !sw) return interaction.reply({
                embeds: [textEmbed(`No weights found for user ${sUser}.`)],
                ephemeral: true
            });

            // If an initial token is supplied, make sure it is in the dataset
            if (sInitial && !sfw.has(sInitial)) return interaction.reply({
                embeds: [textEmbed(`Token \`${sInitial}\` is not a start token in weights.`)],
                ephemeral: true
            });

            const init = sInitial ?? predictFOFromWeights(sfw)[0];
            const sTokens = predictSOFromWeights(sw, init);
            return interaction.reply({
                content: sTokens.join(' '),
                allowedMentions: { parse: [] }
            });

        case 'markov-fo':
            const fUser = interaction.options.getUser('mimic');
            const fInitial = interaction.options.getString('token');

            const fw = fUser
                ? (await d.foKeyedWeights)[fUser.id]
                : await d.foWeights;

            // Only nullable if we are using user-keyed weights. TODO?
            if (!fw) return interaction.reply({
                embeds: [textEmbed(`No weights found for user ${fUser}.`)],
                ephemeral: true
            });

            // If an initial token is supplied, make sure it is in the dataset
            if (fInitial && !fw.has(fInitial)) return interaction.reply({
                embeds: [textEmbed(`Token \`${fInitial}\` does not exist in weights.`)],
                ephemeral: true
            });

            const fTokens = predictFOFromWeights(fw, fInitial);
            return interaction.reply({
                content: fTokens.join(' '),
                allowedMentions: { parse: [] }
            });

        case 'markov-weights':
            const token = interaction.options.getString('token') ?? EOF;
            const res = (await d.foWeights).get(token);

            if (!res) return interaction.reply({
                embeds: [textEmbed(`Token \`${token === EOF ? 'EOF' : token}\` is not present in the weights.`)],
                ephemeral: true
            });

            // TODO: limit the number of pages?
            const sum = [...res.values()].reduce((a, b) => a + b, 0);
            const entries = [...res.entries()].sort(([, v1], [, v2]) => v2 - v1);

            const embeds = chunked(entries, 10).map((chunk, i) => {
                const fields = chunk
                    .map(([tok, weight], j) => `${i * 10 + j + 1}. **${tok === EOF ? '`EOF`' : tok}**: ${(weight * 100 / sum).toFixed(2)}%`)
                    .join('\n');

                return textEmbed(`Successors for token \`${token === EOF ? 'EOF' : token}\`:\n${fields}`)
                    .setTitle(token === EOF ? 'EOF' : token);
            });

            return paginate(interaction, embeds);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const d = weights[interaction.guildId!];

    // Autocomplete `token` fields for first-order commands
    if (interaction.commandName === 'markov-fo' || interaction.commandName === 'markov-weights') {
        const query = interaction.options.getFocused();
        const options = [...(await d.foWeights).entries()]
            .filter(([s]) => s !== EOF && s.length <= 100 && s.toLowerCase().includes(query.toLowerCase()))
            .sort(([, v1], [, v2]) => [...v2.values()].reduce((a, b) => a + b, 0) - [...v1.values()].reduce((a, b) => a + b, 0))
            .map(([s]) => ({ name: s, value: s }))
            .slice(0, 25);

        interaction.respond(options);
    }
})

void client.login(process.env.TOKEN);
