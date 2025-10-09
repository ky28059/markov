import { getMessages, saveWeights } from '../util/data';
import { getTokens, updateStartTokenWeight, updateWeightsForToken, Weights } from '../util/train';


;(async () => {
    const weights: Weights = { total: 0, counts: new Map() };

    const messages = await getMessages();

    for (const message of messages) {
        const tokens = getTokens(message);
        if (!tokens.length) continue;

        // First-order Markov chain on tokens
        updateStartTokenWeight(weights, tokens[0]);
        for (let i = 0; i < tokens.length; i++) {
            updateWeightsForToken(weights, tokens[i], tokens[i + 1]);
        }

        console.log('Processed tokens:', weights.total);
    }

    await saveWeights('first_ord_words', weights);
})();
