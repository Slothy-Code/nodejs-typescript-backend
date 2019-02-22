import 'mocha';
import {expect} from 'chai';
import {Route} from '../../../system/decorators/route';

class ExampleClass {
    @Route({route: '/', type: 'post', permission: 'test3'})
    public exampleFunction1() {
        console.log('test');
    }

    @Route({route: '/', type: 'post'})
    public exampleFunction2() {
        console.log('test');
    }

    @Route({route: '/'})
    public exampleFunction3() {
        console.log('test');
    }
}

describe('Route decorator', () => {

    it('should decorate function1', () => {
        let exampleObject = new ExampleClass();

        let func = exampleObject.exampleFunction1;

        expect(func['route']).to.equal('/');
        expect(func['type']).to.equal('post');
    });

    it('should decorate function2', () => {
        let exampleObject = new ExampleClass();

        let func = exampleObject.exampleFunction2;

        expect(func['route']).to.equal('/');
        expect(func['type']).to.equal('post');
        expect(func['permission']).to.be.undefined;

    });

    it('should decorate function3', () => {
        let exampleObject = new ExampleClass();

        let func = exampleObject.exampleFunction3;

        expect(func['route']).to.equal('/');
        expect(func['type']).to.equal('get');
        expect(func['permission']).to.be.undefined;

    });

});
