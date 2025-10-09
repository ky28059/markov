export type Weights = Map<string, Map<string, number>>
export type SerializedWeights = Record<string, Record<string, number>>


export function getTokens(text: string) {
    // TODO: fancier tokenization?
    return [...text.matchAll(/\S+/g)].map(s => s[0]);
}

export const EOF = '\x00';
export const SEP = '\x01'

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
        counts = new Map()
        weights.set(token, counts);
    }

    // Update the count for the next token
    if (!counts.get(next)) counts.set(next, 0);
    counts.set(next, counts.get(next)! + 1);
}

export function updateHOWeightsForToken(weights: Weights, tokens: string[], n: string | undefined) {
    updateWeightsForToken(weights, tokens.join(SEP), n);
}
