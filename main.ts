// main.ts — hands "Hidden Worlds" in: copies game/ and screenshots/ to the
// output dir and writes /output/dossier.json with the vendored make.fun
// library. Node 22, standard library only; /output comes from
// MAKEFUN_OUTPUT_DIR outside the grader.
//
// The grader mounts /output as a bind mount, so this program never removes
// the output directory itself: it creates it, then clears only what is
// inside it (directories are chmodded to 0755 on the way down first, because
// cpSync keeps the read-only modes of the sources and removing a file needs
// write permission on its parent directory).

import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Make sure the output directory exists, then empty it without removing it.
function clearContents(dir) {
  for (const name of readdirSync(dir)) {
    const target = join(dir, name);
    const info = statSync(target);
    if (info.isDirectory()) {
      chmodSync(target, 0o755);
      clearContents(target);
    }
    rmSync(target, { recursive: true, force: true });
  }
}

mkdirSync(outDir, { recursive: true });
clearContents(outDir);

cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The sealed scorer's caps: text at most 160 KiB, at most 4 screenshots of
// at most 256 KiB each, game/ at most 993 files and 48 MiB in all.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
