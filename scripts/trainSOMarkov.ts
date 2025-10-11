import { getMessages, saveWeights } from '../util/data';
import { trainSOWeights } from '../util/train';


;(async () => {
    const id = process.argv[2] ?? '511675552386777099';
    console.log('Training weights for', id);

    const messages = await getMessages();
    const weights = await trainSOWeights(messages);

    await saveWeights('second_ord_words', id, weights);
})();
