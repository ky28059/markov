import { getMessages, saveWeights } from '../util/data';
import { trainSOWeights } from '../util/train';


;(async () => {
    const messages = await getMessages();
    const weights = await trainSOWeights(messages);

    await saveWeights('second_ord_words', weights);
})();
