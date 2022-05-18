# Informe - Práctica 10: Sistema de ficheros y creación de procesos en Node.js

En esta práctica se han resuelto una serie de ejercicios haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.

## Estructura del proyecto

```bash
.
├── README.md
├── _config.yml
├── coverage
├── data
├── dist
├── doc
├── index.md
├── node_modules
├── package-lock.json
├── package.json
├── sonar-project.properties
├── src
├── tests
├── tsconfig.json
└── typedoc.json
```

# Ejercicio 1

Se ha realizado una traza de ejecución mostrando, paso a paso, el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores, además de lo que se muestra por la consola.

```typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

Si el nombre de fichero es válido, se continuará con la ejecución del programa colocando el metodo access en la pila de llamadas.

- Pila de llamadas: err => {} || access()
- Registro de eventos: -
- Cola: -
- Consola: -

Luego, se añade en el registro de eventos ya que es un método asíncrono.

- Pila de llamadas: -
- Registro de eventos: err => {}
- Cola: -
- Consola: -

El método `access()`se usa para probar los permisos de un archivo o directorio determinado. Los posibles permisos son los siguientes:

- R_OK: checkea el permiso de lectura.
- W_OK: checkea el permiso de escritura.
- F_OK: checkea si el fichero existe
- X_OK: checkea el permiso de ejecución.

Cuando se ejecute tendremos los siguiente:

- Pila de llamadas: -
- Registro de eventos: -
- Cola: err => {}
- Consola: -

Ahora, se introducen y ejecutan los procesos de la cola en la pila de llamadas. Pueden pasar dos cosas:

1. Ocurre un error. En este caso:

- Pila de llamadas: err => {.....}
- Registro de eventos: -
- Cola: -
- Consola: File ${filename} does not exist

2. Se ejecuta correctamente, sin errores.

- Pila de llamadas: err => {.....}
- Registro de eventos: -
- Cola: -
- Consola: Starting to watch file ${filename}

A continuacion, se crea el watcher y este comienza a detectar los cambios.

- Pila de llamadas: watcher.on('change', () => {} || err => {.....}
- Registro de eventos: -
- Cola: -
- Consola: -

Se queda esperando pero cuando se produzca un cambio. El siguiente proceso se repite cada vez que se modifica el archivo:

- Pila de llamadas: -
- Registro de eventos: watcher.on('change', () => {}
- Cola: -
- Consola: -

- Pila de llamadas: -
- Registro de eventos: watcher.on('change', () => {}
- Cola: console.log(`File ${filename} has been modified somehow`)
- Consola: -

- Pila de llamadas: -
- Registro de eventos: watcher.on('change', () => {}
- Cola: -
- Consola: File ${filename} has been modified somehow

## Ejercicio 2

Este ejercicio implementa un programa que devuelve el número de ocurrencias de una palabra en un fichero de texto. Para resolverlo se ha implementado el patrón Template. La clase abstracta MehtodTemplate especifica un método `catGrepCommand()`que será implementado de distinta forma según nos pide el ejercicio.

```typescript
export abstract class MethodTemplate extends EventEmitter {
  /**
   * Inicializa la plantilla
   * @param file Nombre del fichero
   */
  constructor(protected file: string) {
    super();
    this.file = file;
  }

  /**
   * @abstract Realiza el comando cat y grep
   */
  protected abstract catGrepCommand(): void;
}
```

### Método 1

Este método hace uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro. La variable matches guarda el número de ocurrencias de la palabra dentro del fichero que se le pasa al constructor de la clase por parámetro. Para realizar el comando se hace uso de la función `spawn()` que genera un nuevo proceso usando el comando dado, con argumentos de línea de comando en args. Y lo concatenamos usando el método `pipe()`.

```typescript
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
```

### Método 2

Este método sin hacer uso del método pipe, para realizar el comando se hace uso de la función `spawn()` que genera un nuevo proceso usando el comando dado, con argumentos de línea de comando en args. Y lo concatenamos usando el método `pipe()`. Concatenamos el siguiente comando como uno de los argumentos que se la pasan al método `spawn()`

```typescript
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
```

## Ejercicio 3

### La clase Nota

Esta clase es la encargada de representar una nota de la aplicación de procesamiento y estará formada, como mínimo, por un título, un cuerpo y un color.

El título es una especie de nombre que serviría para identificar y diferenciar una nota del resto, por ello se representa como un atributo privado string. El cuerpo de la nota desarrolla, a partir de lo anticipado en el título, el resto de datos informativos y, al igual que el título, es un atributo privado string. El color es la impresión producida por un tono de luz en los órganos visuales, en este caso, se ha optado por definir un tipo de dato Color, que contiene las cadenas (strings) con los colores permitidos:

```typescript
export type Color = 'rojo' | 'verde' | 'azul' | 'amarillo';
```

El constructor de la clase recibe los atributos de la clase se han declarado como readonly, es decir, su valor es solo de lectura, pues no cambiarán nunca durante la ejecución. A raíz de esto, solo se necesitan métodos getter en la clase nota para cada uno de los atributos:

```typescript
public getTitulo(): string {
  return this.titulo;
}

public getColor(): Color {
  return this.color;
}

public getCuerpo(): string {
  return this.cuerpo;
}
```

Además, se ha definido un método `write()` que convierte un objeto de la clase en formato JSON, ya que es un requisito guardar las notas en este formato. Este método invoca a la función `stringify()` que convierte un objeto en una cadena de texto JSON.

```typescript
public write(): string {
  return JSON.stringify(this, null, 2);
}
```

### La clase AppNotas

Esta clase se encarga de definir el comportamiento de la aplicación de las notas de texto. Para ello, define los métodos requeridos utilizando el API síncrona proporcionada por Node.js para trabajar con el sistema de ficheros.

### Añadir una nota al sistema

Para añadir una nota, se debe comprobar si ya existe el directorio donde se guardan las notas de cada usuario. Para ello, se utiliza la función `existsSync()` que se encarga de comprobar de forma síncrona si un archivo ya existe en la ruta dada o no.

- En caso de que no exista se crea la ruta. En esta práctica se ha definido una ruta que inicia en el directorio /data.
- En otro caso, se crea un objeto Nota con los parámetros recibidos. Luego, se debe comprobar si ya existe una nota con el mismo título.
  - En caso de que así fuera, deberá mostrarse un mensaje de error por la consola.
  - En caso contrario, se añadirá la nueva nota a la lista, utilizando la función `writeFileSync()` y se muestra un mensaje informativo por la consola.

```typescript
public addNota(usuario: string, titulo: string, cuerpo: string, color: Color): string {
  if (!fs.existsSync(`data/${usuario}`)) {
    fs.mkdirSync(`data/${usuario}`, { recursive: true});
  }
  const nota = new Nota(titulo, cuerpo, color);
  if (!fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
    console.log(chalk.green('Nueva nota añadida'));
    return chalk.green('Nueva nota añadida');
  } else {
    console.log(chalk.red('Ya existe una nota con ese título'));
    return chalk.red('Ya existe una nota con ese título');
  }
}
```

### Modificar una nota del sistema

Para modificar una nota se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Para ello, al igual que en la función `addNota()` se utiliza la función `existsSync()` con la ruta de la nota a buscar.

- Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. Para lograr esto, se debe crear un objeto nota, y escribirla en el fichero con la función `writeFileSync()`.
- En caso contrario, debe mostrarse un mensaje de error por la consola.

```typescript
public removeNota(usuario: string, titulo: string): string {
  if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    fs.rmSync(`data/${usuario}/${titulo}.json`);
    console.log(chalk.green('Nota eliminada correctamente'));
    return chalk.green('Nota eliminada correctamente');
  } else {
    console.log(NOEXISTNOTA);
    return NOEXISTNOTA;
  }
}
```

### Borrar una nota del sistema

Para borrar una nota del sistema se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Esto se hace de la misma manera que en los apartados anteriores, es decir, se comprueba con la función `existsSync()` la ruta.

- Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. Para ello, se llama a la función `rmSync()` que se utiliza para eliminar de forma síncrona un archivo en la ruta dada.
- En caso contrario, debe mostrarse un mensaje de error por la consola.

```typescript
public removeNota(usuario: string, titulo: string): string {
  if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    fs.rmSync(`data/${usuario}/${titulo}.json`);
    console.log(chalk.green('Nota eliminada correctamente'));
    return chalk.green('Nota eliminada correctamente');
  } else {
    console.log(NOEXISTNOTA);
    return NOEXISTNOTA;
  }
}
```

### Listar los títulos de las notas del sistema

Para listar se debe comprobar que exista el usuario. Para ello, se utiliza la función `existsSync()` donde se comprueba que exista el directorio donde se guardan las notas de ese usuario, que por requisito, viene definido por su nombre.

A continuación, se debe leer el contenido del directorio, pero primero se comprueba que no este vacío, lo que indicaría que el usuario no ha añadido ninguna nota. Para hacerlo, se utiliza la función `readdirSync()` que le el contenido del directorio pasado por parámetro.

Una vez hecho esto, se guarda en el array de string **allTitulo** todos los nombres de los fichero del directorio, es decir, de todos los títulos. Esta variable, se recorre cada uno de los elementos. La constante **data** guarda el contenido de ese fichero, utiliza la función `readFileSync()` que le el contenido del fichero y convierte el contenido a un objeto y se guarda en la variable **notaObject**, con la función parse() y crea una nueva a partir de este objeto.

Ahora que ya se tiene un objeto Nota se puede acceder a los métodos getters para mostrar el color y el titulo por pantalla.

```typescript
public listNotas(usuario: string): string {
  if (!fs.existsSync(`data/${usuario}`)) {
    console.log(chalk.red('No existe ese usuario'));
    return chalk.red('No existe ese usuario');
  } else if (fs.readdirSync(`data/${usuario}`).length === 0) {
    console.log(chalk.red('No tienes ninguna nota en tu lista'));
    return chalk.red('No tienes ninguna nota en tu lista');
  } else {
    const allTitulo: string[] = fs.readdirSync(`data/${usuario}`);
    const result: string[] = [];
    allTitulo.forEach((titulo) => {
      const data = fs.readFileSync(`data/${usuario}/${titulo}`);
      const notaObject = JSON.parse(data.toString());
      const nota: Nota = new Nota(notaObject.titulo, notaObject.cuerpo, notaObject.color);
      switch (nota.getColor()) {
        case 'azul':
          result.push(chalk.blue(nota.getTitulo()));
          break;
        case 'rojo':
          result.push(chalk.red(nota.getTitulo()));
          break;
        case 'verde':
          result.push(chalk.green(nota.getTitulo()));
          break;
        case 'amarillo':
          result.push(chalk.yellow(nota.getTitulo()));
          break;
      }
    });
    console.log(result.join('\n'));
    return result.join('\n');
  }
}
```

### Leer una nota concreta del sistema

Para leer una nota se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Como se ha ido haciendo esto con la función `existsSync()`y al igual que en el apartado anterior se crea:

- Una variable **data** que contiene el contenido del fichero.
- Una variable **notaObject** que contiene el objeto con los datos del fichero JSON.
- Una variable **nota** que inicializa un objeto Nota a partir del objeto con los datos del fichero JSON.

Ahora solo se debe sacar por pantalla el título y el cuerpo de la nota según el color de esta o un mensaje de error si no existe la nota.

```typescript
public readNota(usuario: string, titulo: string): string {
  if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    const data = fs.readFileSync(`data/${usuario}/${titulo}.json`);
    const notaObject = JSON.parse(data.toString());
    const nota: Nota = new Nota(notaObject.titulo, notaObject.cuerpo, notaObject.color);
    switch (nota.getColor()) {
      case 'azul':
        console.log(chalk.blue(nota.getTitulo(), '\n', nota.getCuerpo()));
        return chalk.blue(nota.getTitulo(), '\n', nota.getCuerpo());
      case 'rojo':
        console.log(chalk.red(nota.getTitulo(), '\n', nota.getCuerpo()));
        return chalk.red(nota.getTitulo(), '\n', nota.getCuerpo());
      case 'verde':
        console.log(chalk.green(nota.getTitulo(), '\n', nota.getCuerpo()));
        return chalk.green(nota.getTitulo(), '\n', nota.getCuerpo());
      case 'amarillo':
        console.log(chalk.yellow(nota.getTitulo(), '\n', nota.getCuerpo()));
        return chalk.yellow(nota.getTitulo(), '\n', nota.getCuerpo());
    }
  } else {
    console.log(NOEXISTNOTA);
    return NOEXISTNOTA;
  }
}
```

### Menú de linea de comandos

Se utilizará el paquete Yargs que permite parsear diferentes argumentos pasados a un programa desde la línea de comandos.

En el fichero [index.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101327372/blob/main/src/index.ts) se definen los comandos de tal forma que se pueda invocar a la aplicación con los argumentos. La estructura del paquete yargs para cada comando es muy parecida, solo cambia el método invocado y los argumentos que recibe cada comando.

En general, con **command** se da un nombre al comando, con **describe** se da una breve descripción del comando y con **builder** se definen los argumentos del comando en este caso seran: _usuario, titulo, cuerpo y color_. Cada argumento tendrá una breve descripción, el tipo del argumento y el **demandOption** se usa para especificar que el argumento es obligatorio.

Por último, para poder procesar los argumentos pasados desde línea de comandos a la aplicación es importante que el punto de entrada o programa principal incluya la siguiente sentencia:

```typescript
yargs.parse()
```

### Watcher

Esta clase controla los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas. Utiliza la función `watch()` devuelve un objeto Watcher, que también es un objeto EventEmitter por ello la clase hereda de EvenEmitter. Esta clase, con cada cambio detectado en el directorio observado, el programa deberá indicar si se ha añadido, modificado o borrado una nota, además de indicar el nombre concreto del fichero creado, modificado o eliminado para alojar dicha nota.

```typescript
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
```

## Ejercicio 4

Se ha desarrollado una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación permite:

- Dada una ruta concreta, mostrar si es un directorio o un fichero.

```typescript
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
```

- Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.

```typescript
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
```

- Listar los ficheros dentro de un directorio.

```typescript
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
```

- Mostrar el contenido de un fichero.

```typescript
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
```

- Borrar ficheros y directorios.

```typescript
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
          this.emit('data', chalk.green(`El fichero: ${this.path} ha sido eliminado correctamente`));
        }
      });
    }
  });
}
```

- Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

```typescript
public move(newPath: string): void {
  fs.rename(this.path, newPath, (err) => {
    if (err) {
      this.emit('error', chalk.red(err.message));
    } else {
      this.emit('data', chalk.green('Se ha movido el archivo'));
    }
  });
}
```

## Documentación

Para generar la documentación se utilizará la API TypeDoc, este framework convierte los comentarios del código fuente de TypeScript en documentación HTML procesada o en un modelo JSON. Es extensible y admite una variedad de configuraciones. Disponible como módulo CLI o de Node.js. Para instalarlo, se ejecuta `npm install --save-dev typedoc`. Y añadir al fichero [package.json](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101327372/blob/main/package.json) la siguiente línea de código:

```json
"scripts": {
  "doc": "typedoc"
}
```

Ahora para generar la documentación sólo se tiene que ejecutar `npm run doc`. Y se guardará en el directorio [docs](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101327372/tree/master/docs).

## GitHub Actions

GitHub Actions es una plataforma de integración y despliegue continuos (IC/DC) que te permite automatizar tu mapa de compilación, pruebas y despliegue. En esta práctica se han definido 3 acciones, alojadas en el directorio [.github/workflows](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101327372/tree/main/.github/workflows):

- Actions de Coveralls, que es un servicio web que permite a los usuarios realizar un seguimiento de la cobertura de código de su aplicación a lo largo del tiempo para optimizar la eficacia de sus pruebas unitarias.
- Actions de Test: GitHub ejecuta las pruebas y proporciona los resultados de cada prueba en la solicitud de extracción, para que pueda ver si el cambio en su rama introduce un error.
- Actions de SonarCloud: que ayuda a evaluar el estado del código y crear aplicaciones con un código limpio y seguro. Además detecta errores y vulnerabilidades y obtiene comentarios instantáneos. Se integra con su plataforma DevOps.
