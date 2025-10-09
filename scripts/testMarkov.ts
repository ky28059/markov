import { loadWeights } from '../util/data';
import { predictFromWeights } from '../util/predict';


;(async () => {
    const weights = await loadWeights('first_ord_words');

    for (let i = 0; i < 10; i++) {
        console.log(predictFromWeights(weights));
    }
})();
