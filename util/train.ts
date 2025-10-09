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

export const EOF = '\x00';
