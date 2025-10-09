import { getMessages, saveWeights } from '../util/data';
import { EOF, getTokens, Weights } from '../util/train';


;(async () => {
    const weights: Weights = { total: 0, counts: new Map() };

    const messages = await getMessages();

    for (const message of messages) {
        const tokens = getTokens(message);

        // First-order Markov chain on tokens
        for (let i = 0; i < tokens.length; i++) {
            weights.total++;

            const token = tokens[i];
            let counts = weights.counts.get(token);
            if (!counts) {
                counts = { total: 0, counts: new Map() }
                weights.counts.set(token, { total: 0, counts: new Map() });
            }
            counts.total++;

            const next = tokens[i + 1] ?? EOF;
            if (!counts.counts.get(next)) counts.counts.set(next, 0);
            counts.counts.set(next, counts.counts.get(next)! + 1);
        }

        console.log('Processed tokens:', weights.total);
    }

    await saveWeights('first_ord_words', weights);
})();
