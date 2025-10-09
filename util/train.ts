export type Weights = {
    total: number,
    counts: Map<string, {
        total: number,
        counts: Map<string, number>
    }>
}

export function getTokens(text: string) {
    // TODO: fancier tokenization?
    return [...text.matchAll(/\S+/g)].map(s => s[0]);
}

const EOF = '\x00';

export function updateStartTokenWeight(weight: Weights, token: string) {
    updateWeightsForToken(weight, EOF, token);
}

export function updateWeightsForToken(weights: Weights, token: string, n: string | undefined) {
    const next = n ?? EOF;
    weights.total++;

    // Update the count for the current token
    let counts = weights.counts.get(token);
    if (!counts) {
        counts = { total: 0, counts: new Map() }
        weights.counts.set(token, { total: 0, counts: new Map() });
    }
    counts.total++;

    // Update the count for the next token
    if (!counts.counts.get(next)) counts.counts.set(next, 0);
    counts.counts.set(next, counts.counts.get(next)! + 1);
}
