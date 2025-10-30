import { getKeyedMessages, getMessages, saveKeyedWeights, saveWeights } from '../util/data';
import { trainFOWeights, trainSOWeights, Weights } from '../util/train';
import { servers } from '../config';


;(async () => {
    for (const id of servers) {
        console.log('Training weights for', id);

        // Unkeyed weights
        const messages = await getMessages(id);

        await saveWeights('first_ord_words', id, await trainFOWeights(messages));
        await saveWeights('second_ord_words', id, await trainSOWeights(messages));

        // Keyed weights
        const data = await getKeyedMessages(id);
        const fo: Record<string, Weights> = {};
        const so: Record<string, Weights> = {};

        for (const [id, messages] of Object.entries(data)) {
            if (messages.length < 10) continue;
            fo[id] = await trainFOWeights(messages);
            so[id] = await trainSOWeights(messages);
        }

        await saveKeyedWeights('first_ord_words', id, fo);
        await saveKeyedWeights('second_ord_words', id, so);
    }
})();
