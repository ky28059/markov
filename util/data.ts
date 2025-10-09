import { readFile, writeFile } from 'node:fs/promises';
import type { SerializedWeights, Weights } from './train';

const MESSAGE_JSON_PATH = './data/messages.json';


export async function getMessages() {
    const raw = await readFile(MESSAGE_JSON_PATH);
    return JSON.parse(raw.toString()) as string[];
}

export async function saveWeights(key: string, weights: Weights) {
    // We have to handle maps a bit carefully, since they don't JSON stringify well.
    await writeFile(`./data/${key}.json`, JSON.stringify({
        total: weights.total,
        counts: Object.fromEntries([...weights.counts.entries()].map(([k, v]) => [k, {
            total: v.total,
            counts: Object.fromEntries(v.counts),
        }])),
    }));
}

export async function loadWeights(key: string): Promise<Weights> {
    const raw = await readFile(`./data/${key}.json`);
    const tmp = JSON.parse(raw.toString()) as SerializedWeights;

    // Again, map back to `Map`s to handle quirky tokens
    // TODO: is this necessary?
    return {
        total: tmp.total,
        counts: new Map(Object.entries(tmp.counts).map(([k, v]) => [k, {
            total: v.total,
            counts: new Map(Object.entries(v.counts))
        }]))
    }
}
