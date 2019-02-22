import 'mocha';
import {expect} from 'chai';
import {Route} from '../../../system/decorators/route';
import {Controller} from '../../../system/decorators/controller';

@Controller('/test')
class ExampleClass {
    @Route({route: '/', type: 'get', permission: 'test.test'})
    public exampleFunction1() {
        console.log('test');
    }

    @Route({route: '/', type: 'get', permission: 'test.test'})
    public exampleFunction2() {
        console.log('test');
    }

    @Route({route: '/'})
    public exampleFunction3() {
        console.log('test');
    }
}

describe('Controller decorator', () => {

    it('should add function getPath which returns href of controller', () => {
        let exampleObject = new ExampleClass();

        expect(exampleObject['getPath']()).to.equal('/test');
    });

    it('should add function getDecoratedMethods which returns decorated methods inside controller', () => {
        let exampleObject = new ExampleClass();

        expect(exampleObject['getDecoratedMethods']()).to.eql([exampleObject.exampleFunction1, exampleObject.exampleFunction2, exampleObject.exampleFunction3]);
    });


});
