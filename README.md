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
