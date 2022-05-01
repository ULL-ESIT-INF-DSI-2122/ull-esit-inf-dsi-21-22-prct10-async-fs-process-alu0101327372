import * as fs from 'fs';
import chalk from 'chalk';
import {EventEmitter} from 'events';

/**
 * Clase que visualiza los cambios en las notas de un usuario.
 */
export class Watcher extends EventEmitter {
  /**
   * Inicializa un objeto.
   * @param user Usuario a observar
   */
  constructor(private readonly user: string) {
    super();
  }

  /**
   * Método que se encarga de hacer la visualiación de los cambios.
   * @returns {fs.FSWatcher} Emisor de eventos simple
   */
  public watch(): fs.FSWatcher {
    console.log(chalk.blue(`Vigilando las notas de ${this.user}:`));
    const watcher = fs.watch(`./data/${this.user}/`, (eventType, filename) => {
      if (eventType == 'rename') {
        this.emit('rename', `La nota ${filename} se ha eliminado`);
      } else if (eventType == 'change') {
        this.emit('change', `La nota ${filename} se ha modificado`);
      } else {
        this.emit('error', `Ha ocurrido un error`);
      }
    });
    return watcher;
  }
}
