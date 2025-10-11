import { getMessages, saveWeights } from '../util/data';
import { trainFOWeights } from '../util/train';


;(async () => {
    const id = process.argv[2] ?? '511675552386777099';
    console.log('Training weights for', id);

    const messages = await getMessages();
    const weights = await trainFOWeights(messages);

    await saveWeights('first_ord_words', id, weights);
})();
