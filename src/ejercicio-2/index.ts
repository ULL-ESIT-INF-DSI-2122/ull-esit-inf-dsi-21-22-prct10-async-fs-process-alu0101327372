import * as fs from 'fs';
import chalk from 'chalk';
import {WithPipeMethod} from './metodo-1';
import {WithoutPipeMethod} from './metodo-2';
import yargs from 'yargs';

yargs.command({
  command: 'command',
  describe: 'CatG + Grep',
  builder: {
    file: {
      describe: 'Filename',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'To check the matches',
      demandOption: true,
      type: 'string',
    },
    method: {
      describe: 'Selects the method that is gonna to use (1 | 2)',
      demandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    if ((typeof argv.file === 'string') &&
      (typeof argv.word === 'string') &&
        (typeof argv.method === 'number')) {
      if (fs.existsSync(argv.file)) {
        if (argv.method === 1) {
          const method1 = new WithPipeMethod(argv.file, argv.word);
          method1.catGrepCommand();
        } else if (argv.method === 2) {
          const method2 = new WithoutPipeMethod(argv.file, argv.word);
          method2.catGrepCommand();
        } else {
          console.log(chalk.red('Option not supported'));
        }
      } else {
        console.log(chalk.red('EEl fichero no existe'));
      }
    }
  },
});

yargs.parse();
