import { register } from 'tsconfig-paths';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
register({ baseUrl: __dirname });

import './server.ts';