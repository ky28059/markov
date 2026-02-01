import type { Command, CommandGroup } from '../util/commands';

import fo from './fo';
import so from './so';
import weights from './weights';
import quasar from './quasar';

export default [fo, so, weights] as (Command | CommandGroup)[];

export const serverCommands = [quasar];
