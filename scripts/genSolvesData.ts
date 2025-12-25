import { readFile, writeFile } from 'node:fs/promises';


;(async () => {
    console.log('Generating solves data');

    const raw = await readFile('./solves.json');
    const parsed = JSON.parse(raw.toString());

    const csv = 'date,category,count\n' + parsed.map(({ ts, category }: any) => `${new Date(ts).toISOString()},${category},1`)
        .join('\n');
    await writeFile(`./solves.csv`, csv);
})();
