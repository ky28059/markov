import { EOF, Weights } from './train';


export function predictFromWeights(weights: Weights) {
    const ret: string[] = [];
    let w = [...weights.get(EOF)!.entries()];

    while (true) {
        const pred = weightedRandom(w);
        if (pred === EOF) return ret;
        ret.push(pred);
        w = [...weights.get(pred)!.entries()];
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
