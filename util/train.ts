export type Weights = Map<string, Map<string, number>>
export type SerializedWeights = Record<string, Record<string, number>>


export function getTokens(text: string) {
    // TODO: fancier tokenization?
    return [...text.matchAll(/\S+/g)].map(s => s[0]);
}

export async function trainFOWeights(messages: [number, string][]) {
    const weights: Weights = new Map();
    let total = 0;

    for (const [ts, message] of messages) {
        // TODO: do smth with timestamp
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

    return weights;
}

export async function trainSOWeights(messages: [number, string][]) {
    const weights: Weights = new Map();
    let total = 0;

    for (const [ts, message] of messages) {
        // TODO do smth with ts
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

    return weights;
}

export function updateStartTokenWeight(weight: Weights, token: string) {
    updateWeightsForToken(weight, EOF, token);
}

export function updateHOStartTokenWeight(weight: Weights, tokens: string[], n: string | undefined) {
    updateHOWeightsForToken(weight, [EOF, ...tokens], n);
}

export function updateWeightsForToken(weights: Weights, token: string, n: string | undefined) {
    const next = n ?? EOF;

    // Update the count for the current token
    let counts = weights.get(token);
    if (!counts) {
        counts = new Map();
        weights.set(token, counts);
    }

    // Update the count for the next token
    if (!counts.get(next)) counts.set(next, 0);
    counts.set(next, counts.get(next)! + 1);
}

export function updateHOWeightsForToken(weights: Weights, tokens: string[], n: string | undefined) {
    updateWeightsForToken(weights, tokens.join(SEP), n);
}

export const EOF = '\x00';
export const SEP = '\x01';
