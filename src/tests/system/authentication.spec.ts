import 'mocha';
import {expect} from 'chai';
import {Authentication} from '../../system/tools/authentication';

describe('Authentication', () => {
    it('should return authentication instance', () => {
        expect(Authentication.getInstance()).to.be.an('object')
    });
});
