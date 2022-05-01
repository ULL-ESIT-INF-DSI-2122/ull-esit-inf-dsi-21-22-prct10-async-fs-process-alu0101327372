import 'mocha';
import {expect} from 'chai';
import chalk from 'chalk';
import {WithPipeMethod} from '../src/ejercicio-2/metodo-1';
import {WithoutPipeMethod} from '../src/ejercicio-2/metodo-2';

describe('Pruebas clase MehtodTemplate', () => {
  describe('Pruebas clase WithPipeMethod', () => {
    it('catGrepCommand() Match found', (done) => {
      const pipe: WithPipeMethod = new WithPipeMethod('prueba.txt', 'Hola');
      pipe.on('close', (message) => {
        expect(message.toString()).to.be.equal(chalk.green('Total matches: 1'));
        done();
      });
      pipe.catGrepCommand();
    });

    it('pipesFind() Match not found', (done) => {
      const pipe: WithPipeMethod = new WithPipeMethod('prueba.txt', 'Pepe');
      pipe.on('close', (message) => {
        // eslint-disable-next-line max-len
        expect(message.toString()).to.be.equal(chalk.red('No matches found for Pepe'));
        done();
      });
      pipe.catGrepCommand();
    });
  });

  describe('Pruebas clase WithoutPipeMethod', () => {
    it('catGrepCommand() Match found', (done) => {
      // eslint-disable-next-line max-len
      const nopipe: WithoutPipeMethod = new WithoutPipeMethod('prueba.txt', 'Hola');
      nopipe.on('close', (message) => {
        expect(message.toString()).to.be.equal(chalk.green('Total matches: 1'));
        done();
      });
      nopipe.catGrepCommand();
    });

    it('pipesFind() Match not found', (done) => {
      // eslint-disable-next-line max-len
      const nopipe: WithoutPipeMethod = new WithoutPipeMethod('prueba.txt', 'Pepe');
      nopipe.on('close', (message) => {
        // eslint-disable-next-line max-len
        expect(message.toString()).to.be.equal(chalk.red('No matches found for Pepe'));
        done();
      });
      nopipe.catGrepCommand();
    });
  });
});
