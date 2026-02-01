import { saveWeights } from '../util/data';
import { trainFOWeights, trainSOWeights } from '../util/train';
import { mkdir } from 'node:fs/promises';


type QuasarResponse = {
    'a-secret': string,
    body: { rowid: number, title: string, date: string, body: string }[],
    views: number
}

;(async () => {
    console.log('Training quasar weights');

    const blog = await (await fetch('https://quasar.name/api/journal')).json() as QuasarResponse;
    console.log(blog);

    const bodies = blog.body.map<[number, string]>(r => [1, r.body]);
    const titles = blog.body.map<[number, string]>(r => [1, r.title]);

    const [fob, sob, fot, sot] = await Promise.all([
        trainFOWeights(bodies),
        trainSOWeights(bodies),
        trainFOWeights(titles),
        trainSOWeights(titles),
    ]);

    await mkdir(`./data/quasar`, { recursive: true });

    await Promise.all([
        saveWeights('first_ord_words', 'quasar', fob),
        saveWeights('second_ord_words', 'quasar', sob),
        saveWeights('first_ord_titles', 'quasar', fot),
        saveWeights('second_ord_titles', 'quasar', sot),
    ]);
})();
