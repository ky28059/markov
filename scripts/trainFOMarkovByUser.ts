import { getKeyedMessages, saveKeyedWeights } from '../util/data';
import { trainFOWeights, Weights } from '../util/train';


;(async () => {
    const data = await getKeyedMessages();
    const ret: Record<string, Weights> = {};

    for (const [id, messages] of Object.entries(data)) {
        if (messages.length < 10) continue;
        ret[id] = await trainFOWeights(messages);
    }

    await saveKeyedWeights('first_ord_words', ret);
})();
