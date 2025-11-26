import { getMessages } from '../util/data';
import { writeFile } from 'node:fs/promises';


;(async () => {
    const id = process.argv[2] ?? '511675552386777099';

    console.log('Generating data for', id);

    const messages = await getMessages(id);
    const counts: Record<string, number> = {};

    for (let i = 1; i < 365; i++) {
        for (let j = 0; j < 24; j++) {
            const d = new Date();
            d.setFullYear(2025, 0, 1);
            d.setHours(j, 0, 0, 0);
            d.setDate(i);
            counts[d.toISOString()] = 0;
        }
    }

    for (const [ts, _] of messages) {
        const d = new Date(ts);
        if (d.getFullYear() !== 2025) continue;
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        counts[d.toISOString()]++;
    }

    const csv = 'date,count\n' + Object.entries(counts).map(([date, count]) => `${date},${count}`)
        .join('\n');
    await writeFile('./heatmap.csv', csv);
})();
