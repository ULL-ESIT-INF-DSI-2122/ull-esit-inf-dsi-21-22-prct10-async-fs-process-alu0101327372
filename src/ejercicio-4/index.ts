import * as yargs from 'yargs';
import {Wrapper} from './Wrapper';

yargs.command({
  command: 'mkdir',
  describe: 'Create a new drectory',
  builder: {
    path: {
      describe: 'Path of the new directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const directory: Wrapper = new Wrapper(`${argv.path}`);
    directory.mkdir();
  },
});

yargs.command({
  command: 'ls',
  describe: 'List the content from a drectory',
  builder: {
    path: {
      describe: 'Path of the directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const directory: Wrapper = new Wrapper(`${argv.path}`);
    directory.ls();
  },
});

yargs.command({
  command: 'cat',
  describe: 'List the content from a archive',
  builder: {
    path: {
      describe: 'Path of the archive',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const directory: Wrapper = new Wrapper(`${argv.path}`);
    directory.cat();
  },
});

yargs.command({
  command: 'rm',
  describe: 'Remove a file or a directory',
  builder: {
    path: {
      describe: 'Path of the file or directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const directory: Wrapper = new Wrapper(`${argv.path}`);
    directory.rm();
  },
});

yargs.command({
  command: 'whatis',
  describe: 'Is a directory or a file',
  builder: {
    path: {
      describe: 'Path of the file or directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const directory: Wrapper = new Wrapper(`${argv.path}`);
    directory.isFileOrDirectory();
  },
});

yargs.parse();
