import { loadWeights } from '../util/data';
import { predictFOFromWeights, predictSOFromWeights } from '../util/predict';


;(async () => {
    const foWeights = await loadWeights('first_ord_words');
    const soWeights = await loadWeights('second_ord_words');

    console.log('First order markov:')
    for (let i = 0; i < 10; i++) {
        console.log(predictFOFromWeights(foWeights));
    }

    console.log('Second order markov:')
    for (let i = 0; i < 10; i++) {
        // Get an initial guess using the first order weights
        const init = predictFOFromWeights(foWeights)[0];
        console.log(predictSOFromWeights(soWeights, init));
    }
})();
