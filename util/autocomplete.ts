import type { AutocompleteInteraction } from 'discord.js';
import type { ServerWeights } from '../bot';
import { EOF } from './train';


export async function autocompleteFOTokens(interaction: AutocompleteInteraction, d: ServerWeights) {
    const query = interaction.options.getFocused();
    const options = [...(await d.foWeights).entries()]
        .filter(([s]) => s !== EOF && s.length <= 100 && s.toLowerCase().includes(query.toLowerCase()))
        .sort(([, v1], [, v2]) => [...v2.values()].reduce((a, b) => a + b, 0) - [...v1.values()].reduce((a, b) => a + b, 0))
        .map(([s]) => ({ name: s, value: s }))
        .slice(0, 25);

    await interaction.respond(options);
}
