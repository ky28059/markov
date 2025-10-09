import { getMessages, saveWeights } from '../util/data';
import { getTokens, updateStartTokenWeight, updateWeightsForToken, Weights } from '../util/train';


;(async () => {
    const weights: Weights = new Map();
    let total = 0;

    const messages = await getMessages();

    for (const message of messages) {
        const tokens = getTokens(message);
        if (!tokens.length) continue;

        // First-order Markov chain on tokens
        updateStartTokenWeight(weights, tokens[0]);
        for (let i = 0; i < tokens.length; i++) {
            updateWeightsForToken(weights, tokens[i], tokens[i + 1]);
        }

        total += tokens.length;
        console.log('Processed tokens:', total);
    }

    await saveWeights('first_ord_words', weights);
})();
