/**
 * @class Plantilla para los metodos que realizan la búsqueda
 * del número de ocurrencias de una palabra en un fichero de texto
 */
export abstract class MethodTemplate {
  /**
   * Inicializa la plantilla
   * @param file Nombre del fichero
   */
  constructor(protected file: string) {
    this.file = file;
  }

  protected abstract catGrepCommand(): void;
}
