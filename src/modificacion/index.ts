import { watch, existsSync } from 'fs';
import { spawn } from 'child_process';

/**
 * @class Clase que observa un archivo y realiza los comandos pasado por argumentos
 */
export class Watcher {
  private command: string;
  private arguments: string[] = [];
  private file: string;

  /**
   * Inicializa el objeto
   * @param array array pasado por parametro con los comandos
   */
  constructor(array: string[]) {
    this.file = array[2];
    this.command = array[3];
    for (let i: number = 3; i < array.length; i++) {
      this.arguments.push(array[i]);
    }
  }

  /**
   * Observa un archivo y hace ls -l -h
   */
  public run() {
    if (existsSync(this.file)) {
      const watcher = watch(this.file, (event, filename) => {
        if (event == 'rename') {
          console.log('El fichero se ha eliminado o renombrado');
          watcher.close();
        } else {
          const argumentArray: string[] = this.arguments.concat(filename);
          const ls = spawn(this.command, argumentArray);
          ls.stdout.pipe(process.stdout);
          let lsOutput = '';
          ls.stdout.on('data', (piece) => lsOutput += piece);
        }
      });
      watcher.on('error', () => {
        console.log('An error has occur');
        watcher.close();
      });
    } else {
      console.log(`El fichero ${this.file} no existe`);
    }
  }
}

// Menú principal
const watcher = new Watcher(process.argv);
watcher.run();
