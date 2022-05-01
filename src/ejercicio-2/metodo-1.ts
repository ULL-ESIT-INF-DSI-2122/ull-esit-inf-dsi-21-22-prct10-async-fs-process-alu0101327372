import {MethodTemplate} from './MethodTemplate';
import {spawn} from 'child_process';
import chalk from 'chalk';

/**
 * @class Clase que implementa el comando usando pipe.
 * @extends MethodTemplate
 */
export class WithPipeMethod extends MethodTemplate {
  /**
   * Inicializa el objeto.
   * @param file Ruta del fichero
   * @param word Palabra a buscar
   */
  constructor(protected file: string, private word: string) {
    super(file);
    this.word = word;
  }

  /**
   * Realiza el comando cat y grep usando pipe.
   */
  public catGrepCommand(): void {
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
        this.emit('close', chalk.red(`No matches found for ${this.word}`));
      } else {
        this.emit('close', chalk.green(`Total matches: ${matches}`));
      }
    });

    grep.on('error', () => {
      this.emit('error', chalk.red('An error has occur'));
    });
  }
}
