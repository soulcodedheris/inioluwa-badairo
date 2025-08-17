import chokidar from 'chokidar';
import { exec } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const watchDir = resolve(root, 'src', 'articles');
let running = false;
let queued = false;

function runBuild() {
  if (running) { queued = true; return; }
  running = true;
  exec('node ./scripts/build-articles.mjs', { cwd: root }, (err, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    running = false;
    if (queued) { queued = false; runBuild(); }
  });
}

console.log(`Watching ${watchDir} for changes...`);
const watcher = chokidar.watch(watchDir, { ignoreInitial: true });
watcher.on('add', runBuild).on('change', runBuild).on('unlink', runBuild);


