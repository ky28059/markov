import { getMinMax } from './misc';

const GRANULARITY = 1_000_000;

export type Weights = Map<string, Map<string, number>>
export type SerializedWeights = Record<string, Record<string, number>>


export function getTokens(text: string) {
    // TODO: fancier tokenization?
    return [...text.matchAll(/\S+/g)].map(s => s[0]);
}

/**
 * Trains first-order Markov weights on the given messages. The weights are a map of
 * `{ token => { nextToken => count } }`.
 *
 * @param messages The messages to train on.
 * @returns The trained first-order weights.
 */
export async function trainFOWeights(messages: [number, string][]) {
    const weights: Weights = new Map();
    let total = 0;

    const [minTs, maxTs] = getMinMax(messages.map(s => s[0]));

    for (const [ts, message] of messages) {
        // Create a scaled s in [0.0, 1.0] and we weight the message ~ to s^2.
        const scale = (ts - minTs) / maxTs;
        const weight = Math.floor((scale ** 2) * GRANULARITY);

        const tokens = getTokens(message);
        if (!tokens.length) continue;

        // First-order Markov chain on tokens
        updateStartTokenWeight(weight, weights, tokens[0]);
        for (let i = 0; i < tokens.length; i++) {
            updateWeightsForToken(weight, weights, tokens[i], tokens[i + 1]);
        }

        total += tokens.length;
        console.log('Processed tokens:', total);
    }

    return weights;
}

/**
 * Trains second-order Markov weights on the given messages. The weights are a map of
 * `{ tok1 SEP tok2 => { tok3 => count } }`.
 *
 * @param messages The messages to train on.
 * @returns The trained second-order weights.
 */
export async function trainSOWeights(messages: [number, string][]) {
    const weights: Weights = new Map();
    let total = 0;

    const [minTs, maxTs] = getMinMax(messages.map(s => s[0]));

    for (const [ts, message] of messages) {
        // Create a scaled s in [0.0, 1.0] and we weight the message ~ to s^2.
        const scale = (ts - minTs) / maxTs;
        const weight = Math.floor((scale ** 2) * GRANULARITY);

        const tokens = getTokens(message);
        if (!tokens.length) continue;

        // Second-order Markov chain on tokens
        updateHOStartTokenWeight(weight, weights, [tokens[0]], tokens[1]);
        for (let i = 0; i < tokens.length - 1; i++) {
            updateHOWeightsForToken(weight, weights, [tokens[i], tokens[i + 1]], tokens[i + 2]);
        }

        total += tokens.length;
        console.log('Processed tokens:', total);
    }

    return weights;
}

function updateStartTokenWeight(weight: number, weights: Weights, token: string) {
    updateWeightsForToken(weight, weights, EOF, token);
}

function updateHOStartTokenWeight(weight: number, weights: Weights, tokens: string[], n: string | undefined) {
    updateHOWeightsForToken(weight, weights, [EOF, ...tokens], n);
}

function updateWeightsForToken(weight: number, weights: Weights, token: string, n: string | undefined) {
    const next = n ?? EOF;

    // Update the count for the current token
    let counts = weights.get(token);
    if (!counts) {
        counts = new Map();
        weights.set(token, counts);
    }

    // Update the count for the next token
    if (!counts.get(next)) counts.set(next, 0);
    counts.set(next, counts.get(next)! + weight);
}

function updateHOWeightsForToken(weight: number, weights: Weights, tokens: string[], n: string | undefined) {
    updateWeightsForToken(weight, weights, tokens.join(SEP), n);
}

export const EOF = '\x00';
export const SEP = '\x01';
