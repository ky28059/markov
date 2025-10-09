import { getMessages, saveWeights } from '../util/data';
import { getTokens, updateHOStartTokenWeight, updateHOWeightsForToken, Weights } from '../util/train';


;(async () => {
    const weights: Weights = new Map();
    let total = 0;

    const messages = await getMessages();

    for (const message of messages) {
        const tokens = getTokens(message);
        if (!tokens.length) continue;

        // Second-order Markov chain on tokens
        updateHOStartTokenWeight(weights, [tokens[0]], tokens[1]);
        for (let i = 0; i < tokens.length - 1; i++) {
            updateHOWeightsForToken(weights, [tokens[i], tokens[i + 1]], tokens[i + 2]);
        }

        total += tokens.length;
        console.log('Processed tokens:', total);
    }

    await saveWeights('second_ord_words', weights);
})();
