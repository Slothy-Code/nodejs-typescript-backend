import 'mocha';
import * as sinon from 'sinon';
import {permissionMiddleware} from '../../../system/middlewares/permission.middleware';

describe('Permissions middleware', () => {
    let stubHttpRequest;

    beforeEach(function () {
        stubHttpRequest = sinon.useFakeXMLHttpRequest();
    });
    it('should return middleware function', () => {
        const middleware = permissionMiddleware('user.create');
        stubHttpRequest.req = {token: 'testToken'};
        stubHttpRequest.next = () => {
            console.log('next mock')
        };
        middleware(stubHttpRequest.req, stubHttpRequest.res, stubHttpRequest.next);

        // let authSpy = sinon.spy(passport, 'authenticate');
        // sinon.assert.called(authSpy);

    });

});
