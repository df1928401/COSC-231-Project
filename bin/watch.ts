import * as chokidar from 'chokidar'
import * as child from 'child_process'
import * as path from 'path'

console.log('Running watch');

let projPath = path.join(__dirname, '..');

let watched = [
    path.join(projPath, 'public'),
    path.join(projPath, 'src')
]

let watcher = chokidar.watch(watched, {
    persistent: true,
    ignoreInitial: true,
    cwd: projPath
});

watcher.on('change', path => {
    console.log('File change detected, recompiling project.');
    child.exec('./bin/build', (error, stdout, stderr) => {
        console.log('Finished recompiling.');
    });
});

watcher.on('error', error => {
    console.log(error);
});