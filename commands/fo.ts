import type { Command } from '../util/commands';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { autocompleteFOTokens } from '../util/autocomplete';
import { textEmbed } from '../util/embeds';
import { predictFOFromWeights } from '../util/predict';


export default {
    data: new SlashCommandBuilder()
        .setName('markov-fo')
        .setContexts(InteractionContextType.Guild)
        .setDescription('Generate some first-order Markov babble.')
        .addUserOption(option => option
            .setName('mimic')
            .setDescription('The user to mimic')
            .setRequired(false))
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to start prediction with.')
            .setAutocomplete(true)
            .setRequired(false)),

    async execute(interaction, d) {
        const user = interaction.options.getUser('mimic');
        const init = interaction.options.getString('token');

        const fw = user
            ? (await d.foKeyedWeights)[user.id]
            : await d.foWeights;

        // Only nullable if we are using user-keyed weights. TODO?
        if (!fw) return interaction.reply({
            embeds: [textEmbed(`No weights found for user ${user}.`)],
            ephemeral: true
        });

        // If an initial token is supplied, make sure it is in the dataset
        if (init && !fw.has(init)) return interaction.reply({
            embeds: [textEmbed(`Token \`${init}\` does not exist in weights.`)],
            ephemeral: true
        });

        const fTokens = predictFOFromWeights(fw, init);
        return interaction.reply({
            content: fTokens.join(' '),
            allowedMentions: { parse: [] }
        });
    },

    autocomplete: autocompleteFOTokens
} satisfies Command;
