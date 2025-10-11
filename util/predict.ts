import { EOF, SEP, Weights } from './train';


/**
 * Given first-order Markov weights, predict a sequence of tokens; this can be done by
 * starting with the start-of-message token, and continuously applying weighted random until
 * we reach the end-of-message token.
 *
 * @param weights The weights to use.
 * @returns The predicted token sequence, as a string[].
 */
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

/**
 * Same as `predictFOFromWeights`, but using second-order weights instead. Since this is
 * second-order, we need an initial token to start; then, we apply [tok1, tok2] -> tok3
 * until end-of-message.
 *
 * @param weights The weights to use.
 * @param initial The initial token to use; this can be gotten for e.g. by doing a single FO prediction.
 * @returns The predicted token sequence, as a string[].
 */
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
