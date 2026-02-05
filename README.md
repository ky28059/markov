# markov
A silly markov chain bot trained on messages in the b01lers server.

### Running locally
Create a `.env` file exporting the bot token like so:
```env
TOKEN=...
```
After adding the bot to a server, if you don't have a local copy of the scraped Discord messages run
```bash
npm run fetch -- [server id]
```
(replacing `[server id]` with the Discord ID of the server to fetch from)
to generate them. Then, train model weights via
```bash
npm run train -- [server id]
```
You can generate some test tokens via
```bash
npm run test -- [server id]
```
or start the bot by running
```bash
npm start
```

### Other functionality
Since `markov` includes utilities for scraping Discord message data, there are other scripts in this repo that export
Discord data for non-training purposes. Specifically,

#### Message heatmaps
```bash
npm run heatmap -- [server id]
```
generates a `heatmap_[id].csv` listing message counts binned by hour for 2025 for heatmap data visualization:
[b01lers-2025-wrapped#server-statistics](https://kevin.fish/b01lers-2025-wrapped#server-statistics)
```
date,count
2025-01-01T05:00:00.000Z,0
2025-01-01T06:00:00.000Z,0
2025-01-01T07:00:00.000Z,1
2025-01-01T08:00:00.000Z,0
2025-01-01T09:00:00.000Z,0
...
```

#### Solves
```bash
npm run fetch:solves
npm run gen:solves
```
fetches (approved) solves from the b01lers #bot-approvals channel (cached in `solves.json`) and generates a `solves.csv`
listing CTF challenge solve counts by timestamp for data visualization: [b01lers-2025-wrapped#solve-statistics](https://kevin.fish/b01lers-2025-wrapped#solve-statistics)
```csv
date,category,count
2025-12-18T17:16:00.018Z,crypto,1
2025-12-18T16:53:03.289Z,rev,1
2025-12-18T04:14:31.823Z,crypto,1
2025-12-18T04:03:41.038Z,misc,1
2025-12-18T04:00:28.516Z,web,1
...
```

### Advanced usage
If you want to only train specific weights, run
```bash
npm run train:fo -- [server id]
```
```bash
npm run train:so -- [server id]
```
```bash
npm run train:global -- [server id]
```
to train server-wide first order, second order, or both weights, respectively.

Similarly, run
```bash
npm run train:fo-keyed -- [server id]
```
```bash
npm run train:so-keyed -- [server id]
```
```bash
npm run train:keyed -- [server id]
```
to train user-keyed first order, second order, or both weights, respectively.
