import { getMessages, saveWeights } from '../util/data';
import { trainFOWeights } from '../util/train';


;(async () => {
    const messages = await getMessages();
    const weights = await trainFOWeights(messages);

    await saveWeights('first_ord_words', weights);
})();
