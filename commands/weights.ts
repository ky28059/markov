import type { Command } from '../util/commands';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { autocompleteFOTokens } from '../util/autocomplete';
import { paginate, textEmbed } from '../util/embeds';
import { chunked } from '../util/misc';
import { EOF } from '../util/train';


export default {
    data: new SlashCommandBuilder()
        .setName('markov-weights')
        .setContexts(InteractionContextType.Guild)
        .setDescription('Sends the trained Markov chain weights for the given token.')
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to inspect weights for.')
            .setAutocomplete(true)
            .setRequired(false)),

    async execute(interaction, d) {
        const token = interaction.options.getString('token') ?? EOF;
        const res = (await d.foWeights).get(token);

        if (!res) return interaction.reply({
            embeds: [textEmbed(`Token \`${token === EOF ? 'EOF' : token}\` is not present in the weights.`)],
            flags: 'Ephemeral'
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
    },

    autocomplete: autocompleteFOTokens
} satisfies Command;
