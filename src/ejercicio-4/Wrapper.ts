import * as fs from 'fs';
import chalk from 'chalk';
import {EventEmitter} from 'events';
import {spawn} from 'child_process';

/**
 * @class Clase que hacer de wrapper de los distintos comandos.
 * @extends EventEmitter
 */
export class Wrapper extends EventEmitter {
  /**
   * Inicializa el objeto.
   * @param path Ruta para hacer los comandos
   */
  constructor(private path: string) {
    super();
    this.path = path;
  }

  /**
   * Muestra el contenido de un fichero.
   */
  public cat(): void {
    fs.readFile(this.path, 'utf8', (err, data) => {
      if (err) {
        this.emit('error', chalk.red(`No se pudo mostrar: ${this.path}`));
        return console.error(chalk.red(err));
      } else {
        this.emit('data', chalk.green(data));
      }
    });
  }

  /**
   * Lista los ficheros dentro de un directorio.
   */
  public ls(): void {
    const ls = spawn('ls', [`${this.path}`]);
    ls.stdout.on('data', () => {
      ls.stdout.pipe(process.stdout);
      this.emit('data', chalk.green('Se ha listado el contenido'));
    });

    ls.stderr.on('data', () => {
      this.emit('error', chalk.red('Error listando el contenido'));
    });
  }

  /**
   * Crea un nuevo directorio a partir de
   * una nueva ruta que recibe como parámetro.
   */
  public mkdir(): void {
    fs.mkdir(this.path, (err) => {
      if (err) {
        this.emit('error',
            chalk.red(`No se pudo crear el directorio: ${this.path}`));
        return console.error(chalk.red(err));
      } else {
        this.emit('data',
            chalk.green(`Se creó el directorio: ${this.path} correctamente`));
      }
    });
  }

  /**
   * Borra ficheros y directorios.
   */
  public rm(): void {
    fs.lstat(`${this.path}`, (err, stats) => {
      if (err) {
        this.emit('error', chalk.red(err));
        return console.error(chalk.red(err));
      }

      if (stats.isDirectory()) {
        fs.rmdir(`${this.path}`, (err) => {
          if (err) {
            this.emit('error',
                chalk.red(`No se pudo borrar el directorio: ${this.path}`));
            return console.error(chalk.red(err));
          } else {
            // eslint-disable-next-line max-len
            this.emit('data', chalk.green(`El directorio: ${this.path} ha sido eliminado correctamente`));
          }
        });
      } else if (stats.isFile()) {
        fs.unlink(`${this.path}`, (err) => {
          if (err) {
            this.emit('error',
                chalk.red(`No se pudo borrar el fichero: ${this.path}`));
            return console.error(chalk.red(err));
          } else {
            // eslint-disable-next-line max-len
            this.emit('data', chalk.green(`El fichero: ${this.path} ha sido eliminado correctamente`));
          }
        });
      }
    });
  }

  /**
   * Dada una ruta concreta, muestra si es un directorio o un fichero.
   */
  public isFileOrDirectory(): void {
    fs.lstat(`${this.path}`, (err, stats) => {
      if (err) {
        this.emit('error', chalk.red(err));
        return console.log(err);
      }

      if (stats.isDirectory()) {
        this.emit('data', chalk.green(`${this.path} es un directorio`));
      } else if (stats.isFile()) {
        this.emit('data', chalk.green(`${this.path} es un fichero`));
      }
    });
  }

  /**
   * Mueve y copia ficheros y/o directorios de una ruta a otra.
   * @param newPath Ruta de destino
   */
  public move(newPath: string): void {
    fs.rename(this.path, newPath, (err) => {
      if (err) {
        this.emit('error', chalk.red(err.message));
      } else {
        this.emit('data', chalk.green('Se ha movido el archivo'));
      }
    });
  }
}
