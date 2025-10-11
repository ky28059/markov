import { getKeyedMessages, saveKeyedWeights } from '../util/data';
import { trainSOWeights, Weights } from '../util/train';


;(async () => {
    const id = process.argv[2] ?? '511675552386777099';
    console.log('Training weights for', id);

    const data = await getKeyedMessages();
    const ret: Record<string, Weights> = {};

    for (const [id, messages] of Object.entries(data)) {
        if (messages.length < 10) continue;
        ret[id] = await trainSOWeights(messages);
    }

    await saveKeyedWeights('second_ord_words', id, ret);
})();
