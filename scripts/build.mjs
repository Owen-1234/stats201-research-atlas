import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const files = (await readdir(root)).filter((file) => /\.(html|css|js)$/.test(file));
for (const file of [...files, 'assets', 'evidence']) {
  await cp(path.join(root, file), path.join(output, file), { recursive: true });
}
await mkdir(path.join(output, 'notes'), { recursive: true });
await cp(path.join(root, 'notes/speaker-notes.md'), path.join(output, 'notes/speaker-notes.md'));
console.log(`Built ${files.length} page/script/style files, bundled assets, and research evidence into dist/.`);
