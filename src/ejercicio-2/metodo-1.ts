import { MethodTemplate } from './MethodTemplate';
import { spawn } from 'child_process';
import chalk from 'chalk';

export class WithPipeMethod extends MethodTemplate {
  constructor(protected file: string, private word: string) {
    super(file);
    this.word = word;
  }

  public catGrepCommand() {
    const grep = spawn('grep', [this.word]);
    spawn('cat', [this.file]).stdout.pipe(grep.stdin);

    let matches = 0;
    let output = '';
    grep.stdout.on('data', (piece) => {
      output += piece;
    });

    grep.on('close', () => {
      console.log(chalk.green(output));
      const result = output.split(/\s+/);
      result.forEach((element) => {
        if (this.word === element) {
          matches++;
        }
      });

      if (matches === 0) {
        console.log(chalk.red(`No matches found for ${this.word}`));
      } else {
        console.log(chalk.green(`Total matches: ${matches}`));
      }
    });

    grep.on('error', () => {
      console.log(chalk.red('An error has occur'));
    });
  }
}
