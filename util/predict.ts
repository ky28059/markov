import { EOF, SEP, Weights } from './train';


export function predictFOFromWeights(weights: Weights) {
    const ret: string[] = [];
    let w = [...weights.get(EOF)!.entries()];

    while (true) {
        const pred = weightedRandom(w);
        if (pred === EOF) return ret;
        ret.push(pred);
        w = [...weights.get(pred)!.entries()];
    }
}

export function predictSOFromWeights(weights: Weights, initial: string) {
    const ret: string[] = [initial];

    let tok1 = EOF;
    let tok2 = initial;

    let w = [...weights.get(tok1 + SEP + tok2)!.entries()];

    while (true) {
        const pred = weightedRandom(w);
        if (pred === EOF) return ret;
        ret.push(pred);

        // Shift context window left by one
        tok1 = tok2;
        tok2 = pred;
        w = [...weights.get(tok1 + SEP + tok2)!.entries()];
    }
}

// https://stackoverflow.com/a/55671924
function weightedRandom(options: [string, number][]) {
    let i = 0;
    const weights = [options[0][1]];

    for (i = 1; i < options.length; i++)
        weights[i] = options[i][1] + weights[i - 1];

    const random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) break;
    }
    return options[i][0];
}
