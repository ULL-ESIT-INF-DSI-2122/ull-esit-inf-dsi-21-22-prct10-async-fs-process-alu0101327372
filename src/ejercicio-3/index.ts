import {Watcher} from './Watcher';

if (process.argv[2] === undefined) {
  console.log('Diga un usuario');
} else {
  new Watcher(process.argv[2]).watch();
}
