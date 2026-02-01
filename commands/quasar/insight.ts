import type { Subcommand } from '../../util/commands';
import { SlashCommandSubcommandBuilder } from 'discord.js';
import { textEmbed } from '../../util/embeds';
import { predictSOFromWeights, predictFOOnce } from '../../util/predict';
import { loadWeights } from '../../util/data';
import { EOF } from '../../util/train';


// TODO?
const qfw = loadWeights('first_ord_words', 'quasar');
const qsw = loadWeights('second_ord_words', 'quasar');

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('insight')
        .setDescription('Generate some wise quasar insight.')
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to start prediction with.')
            .setRequired(false)),

    async execute(interaction, d) {
        const uInit = interaction.options.getString('token');

        const fw = await qfw;
        const sw = await qsw;

        // If an initial token is supplied, make sure it is in the dataset
        if (uInit && !fw.get(EOF)!.has(uInit)) return interaction.reply({
            embeds: [textEmbed(`Token \`${uInit}\` is not a start token in weights.`)],
            flags: 'Ephemeral'
        });

        const init = uInit ?? predictFOOnce(fw);
        const sTokens = predictSOFromWeights(sw, init);
        return interaction.reply({
            content: sTokens.join(' '),
            allowedMentions: { parse: [] }
        });
    }
} satisfies Subcommand;
