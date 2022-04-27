import { MethodTemplate } from './MethodTemplate';
import { spawn } from 'child_process';
import chalk from 'chalk';

export class WithoutPipeMethod extends MethodTemplate {
  constructor(protected file: string, private word: string) {
    super(file);
    this.word = word;
  }

  public catGrepCommand() {
    const command = spawn('cat', [this.file, 'grep', this.word]);

    let matches = 0;
    let output = '';
    command.stdout.on('data', (piece) => {
      output += piece;
    });

    command.on('close', () => {
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

    command.on('error', () => {
      console.log(chalk.red('An error has occur'));
    });
  }
}
