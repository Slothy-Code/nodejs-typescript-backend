import 'mocha';
import {expect} from 'chai';
import {Route} from '../../../system/decorators/route';
import {Controller} from '../../../system/decorators/controller';

@Controller('/test')
class ExampleClass {
    @Route('/', 'test2', 'test3')
    public exampleFunction1() {
        console.log('test');
    }

    @Route('/', 'test2')
    public exampleFunction2() {
        console.log('test');
    }

    @Route('/')
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
