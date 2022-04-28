import * as fs from 'fs';
import chalk from 'chalk';

export class Watcher {
  constructor(private readonly user: string) {
    // Este constructor solo inicializa el objeto
  }

  public watch(): void {
    fs.access(`./data/${this.user}/`, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`El usario ${this.user} no existe`));
      } else {
        console.log(chalk.blue(`Vigilando las notas de ${this.user}:`));
        fs.watch(`./data/${this.user}/`, (eventType, filename) => {
          console.log(chalk.green(`\nEl fichero ${filename} ha cambiado!`));
          console.log(chalk.green(`El cambio fue de tipo: ${eventType}`));
        });
      }
    });
  };
}
