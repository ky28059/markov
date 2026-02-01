import type { Subcommand } from '../../util/commands';
import { SlashCommandSubcommandBuilder } from 'discord.js';
import { textEmbed } from '../../util/embeds';
import { predictFOFromWeights } from '../../util/predict';
import { loadWeights } from '../../util/data';


// TODO?
const tfw = loadWeights('first_ord_titles', 'quasar');
// const tsw = loadWeights('second_ord_titles', 'quasar');

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('title')
        .setDescription('Generate a wise quasar journal post title.')
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to start prediction with.')
            .setRequired(false)),

    async execute(interaction, d) {
        const init = interaction.options.getString('token');

        const fw = await tfw;

        // If an initial token is supplied, make sure it is in the dataset
        if (init && !fw.has(init)) return interaction.reply({
            embeds: [textEmbed(`Token \`${init}\` does not exist in weights.`)],
            flags: 'Ephemeral'
        });

        const fTokens = predictFOFromWeights(fw, init);
        return interaction.reply({
            content: '# ' + fTokens.join(' '),
            allowedMentions: { parse: [] }
        });
    }
} satisfies Subcommand;
