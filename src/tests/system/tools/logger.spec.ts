import 'mocha';
import * as sinon from 'sinon';
import {Logger} from '../../../system/tools/logger';
import {expect} from 'chai';
import chalk from 'chalk';


describe('Logger', () => {
    const logger = new Logger('TestLogger', 'red')
    const consoleSpy = sinon.spy(console, 'log');

    it('should create logger instance', () => {
        expect(logger).to.be.instanceOf(Logger);
    })

    it('should log', () => {
        logger.log('test');

        sinon.assert.calledWith(consoleSpy, chalk.red('[TestLogger] ') + 'test');
    });

    it('should log error message', () => {
        logger.error('error');

        sinon.assert.calledWith(consoleSpy, chalk.red('[TestLogger] ') + chalk.red('error'));
    });

    it('should log success message', () => {
        logger.success('success');

        sinon.assert.calledWith(consoleSpy, chalk.red('[TestLogger] ') + chalk.greenBright('success'));
    })

    it('should create logger if color not given', () => {
        expect(new Logger('test')).to.be.instanceOf(Logger);
    })

    it('should create logger if either color and namenot given', () => {
        expect(new Logger()).to.be.instanceOf(Logger);
    })
})