import 'mocha';
import {expect} from 'chai';
import {Route} from '../../../system/decorators/route';
import {DTOValidate} from '../../../system/decorators/dto-validate';
import {MinLength} from 'class-validator';
import {Controller} from '../../../system/decorators/controller';

class ExampleDto {
    @MinLength(3)
    text: string;
}

@Controller('/test')
class ExampleClass {
    @DTOValidate(ExampleDto)
    @Route({route: '/', type: 'post', permission: 'test3'})
    public exampleFunction() {
        console.log('test');
    }
}

describe('DTO Validate decorator', () => {

    it('should decorate function4', () => {
        let exampleObject = new ExampleClass();

        let func = exampleObject.exampleFunction;

        expect(func['dtoMiddleware']).to.be.an.instanceOf(Function);
    });

});
