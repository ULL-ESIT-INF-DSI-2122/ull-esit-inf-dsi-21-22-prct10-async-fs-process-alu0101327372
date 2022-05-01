import 'mocha';
import {expect} from 'chai';
import chalk from 'chalk';
import {Wrapper} from '../src/ejercicio-4/Wrapper';

describe('Pruebas clase Wrapper', () => {
  it('cat()', (done) => {
    const wrapper: Wrapper = new Wrapper('prueba.txt');
    wrapper.on('data', (message) => {
      expect(message.toString()).to.be.equal(chalk.green('Hola Mundo'));
      done();
    });
    wrapper.cat();
  });

  it('ls()', (done) => {
    const wrapper: Wrapper = new Wrapper('tests');
    wrapper.on('data', (message) => {
      // eslint-disable-next-line max-len
      expect(message.toString()).to.be.equal(chalk.green('Se ha listado el contenido'));
      done();
    });
    wrapper.ls();
  });

  it('mkdir()', (done) => {
    const wrapper: Wrapper = new Wrapper('tests/directorio');
    wrapper.on('data', (message) => {
      // eslint-disable-next-line max-len
      expect(message.toString()).to.be.equal(chalk.green(`Se creó el directorio: tests/directorio correctamente`));
      done();
    });
    wrapper.mkdir();
  });

  it('move()', (done) => {
    const wrapper: Wrapper = new Wrapper('tests/directorio');
    wrapper.on('data', (message) => {
      // eslint-disable-next-line max-len
      expect(message.toString()).to.be.equal(chalk.green(`Se ha movido el archivo`));
      done();
    });
    wrapper.move('src/directorio');
  });

  it('rm()', (done) => {
    const wrapper: Wrapper = new Wrapper('src/directorio');
    wrapper.on('data', (message) => {
      // eslint-disable-next-line max-len
      expect(message.toString()).to.be.equal(chalk.green(`El directorio: src/directorio ha sido eliminado correctamente`));
      done();
    });
    wrapper.rm();
  });

  it('isFileOrDirectory()', (done) => {
    const wrapper: Wrapper = new Wrapper('prueba.txt');
    wrapper.on('data', (message) => {
      // eslint-disable-next-line max-len
      expect(message.toString()).to.be.equal(chalk.green(`prueba.txt es un fichero`));
      done();
    });
    wrapper.isFileOrDirectory();
  });
});
