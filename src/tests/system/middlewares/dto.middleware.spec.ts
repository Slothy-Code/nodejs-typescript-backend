import 'mocha';
import * as classValidator from 'class-validator';
import {MinLength, ValidationError} from 'class-validator';
import * as sinon from 'sinon';
import {DTOMiddleware} from '../../../system/middlewares/dto.middleware';
import {HttpException} from '../../../system/exceptions/http-exception';

class ExampleDto {
    @MinLength(3)
    text: string;
}

describe('DTO Middleware', () => {
    let mw = null;
    let validateStub = null;
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        mw = DTOMiddleware(ExampleDto, true);

        validateStub = sandbox.stub(classValidator, 'validate');
    });

    afterEach(() => {
        sandbox.restore();
    })

    it('should pass if data is valid', async () => {
        const nextSpy = sinon.spy();

        validateStub.returns(Promise.resolve([]));

        await mw({body: {text: 'test'}}, {}, nextSpy);

        sinon.assert.calledOnce(nextSpy);
    });


    it('should not pass if data is invalid', async () => {
        const nextSpy = sinon.spy();

        const testError = new ValidationError();
        testError.constraints = {'error': 'test'};
        validateStub.returns(Promise.resolve([testError]));

        await mw({body: {text: 't'}}, {}, nextSpy);


        sinon.assert.calledWith(nextSpy, sinon.match.instanceOf(HttpException));
    });

});