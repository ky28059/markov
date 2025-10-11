import { loadWeights } from '../util/data';
import { predictFOFromWeights, predictSOFromWeights } from '../util/predict';


;(async () => {
    const id = process.argv[2] ?? '511675552386777099';

    console.log('Loading weights for', id);

    const fw = await loadWeights('first_ord_words', id);
    const sw = await loadWeights('second_ord_words', id);

    console.log('First order markov:')
    for (let i = 0; i < 10; i++) {
        console.log(predictFOFromWeights(fw));
    }

    console.log('Second order markov:')
    for (let i = 0; i < 10; i++) {
        // Get an initial guess using the first order weights
        const init = predictFOFromWeights(fw)[0];
        console.log(predictSOFromWeights(sw, init));
    }
})();
