import {EventEmitter} from 'events';

/**
 * @class Plantilla para los metodos que realizan la búsqueda.
 * del número de ocurrencias de una palabra en un fichero de texto
 * @extends EventEmitter
 */
export abstract class MethodTemplate extends EventEmitter {
  /**
   * Inicializa la plantilla.
   * @param file Nombre del fichero
   */
  constructor(protected file: string) {
    super();
    this.file = file;
  }

  /**
   * @abstract Realiza el comando cat y grep.
   */
  protected abstract catGrepCommand(): void;
}
