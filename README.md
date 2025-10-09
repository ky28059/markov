# markov
A silly markov chain bot trained on messages in the b01lers server.

### Running locally
Create a `.env` file exporting the bot token like so:
```env
TOKEN=...
```
If you don't have a local copy of the scraped Discord messages, run
```bash
npm run fetch
```
to generate them. Then, train model weights via
```bash
npm run train
```
and generate some test output via
```bash
npm run test
```
Start the bot by running
```bash
npm start
```
