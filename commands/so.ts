import type { Command } from '../util/commands';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { textEmbed } from '../util/embeds';
import { predictFOFromWeights, predictSOFromWeights } from '../util/predict';


export default {
    data: new SlashCommandBuilder()
        .setName('markov')
        .setDescription('Generate some second-order Markov babble.')
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option => option
            .setName('mimic')
            .setDescription('The user to mimic')
            .setRequired(false))
        .addStringOption(option => option
            .setName('token')
            .setDescription('The token to start prediction with.')
            .setRequired(false)),

    async execute(interaction, d) {
        const user = interaction.options.getUser('mimic');
        const uInit = interaction.options.getString('token');

        // If a user is supplied, use the keyed weights for that user instead
        const fw = user
            ? (await d.foKeyedWeights)[user.id]
            : await d.foWeights;
        const sw = user
            ? (await d.soKeyedWeights)[user.id]
            : await d.soWeights;

        // TODO?
        if (!fw || !sw) return interaction.reply({
            embeds: [textEmbed(`No weights found for user ${user}.`)],
            flags: 'Ephemeral'
        });

        // If an initial token is supplied, make sure it is in the dataset
        if (uInit && !fw.has(uInit)) return interaction.reply({
            embeds: [textEmbed(`Token \`${uInit}\` is not a start token in weights.`)],
            flags: 'Ephemeral'
        });

        const init = uInit ?? predictFOFromWeights(fw)[0];
        const sTokens = predictSOFromWeights(sw, init);
        return interaction.reply({
            content: sTokens.join(' '),
            allowedMentions: { parse: [] }
        });
    }
} satisfies Command;
