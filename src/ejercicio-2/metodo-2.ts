import {MethodTemplate} from './MethodTemplate';
import {spawn} from 'child_process';
import chalk from 'chalk';

/**
 * @class Clase que implementa sin el comando usando pipe.
 * @extends MethodTemplate
 */
export class WithoutPipeMethod extends MethodTemplate {
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
   * Realiza el comando cat y grep sin pipe.
   */
  public catGrepCommand(): void {
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
        this.emit('close', chalk.red(`No matches found for ${this.word}`));
      } else {
        this.emit('close', chalk.green(`Total matches: ${matches}`));
      }
    });

    command.on('error', () => {
      this.emit('error', chalk.red('An error has occur'));
    });
  }
}
