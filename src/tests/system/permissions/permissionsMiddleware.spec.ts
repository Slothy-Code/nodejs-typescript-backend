import 'mocha';
import {PermissionsMiddleware} from '../../../system/permissions/permissionsMiddleware';
import * as sinon from 'sinon';

describe('Permissions middleware', () => {
    let stubHttpRequest;

    beforeEach(function () {
        stubHttpRequest = sinon.useFakeXMLHttpRequest();
    });
    it('should return middleware function', () => {
        const middleware = PermissionsMiddleware.hasPermission('user.create');
        stubHttpRequest.req = {token: 'testToken'};
        stubHttpRequest.next = () => {
            console.log('next mock')
        };
        middleware(stubHttpRequest.req, stubHttpRequest.res, stubHttpRequest.next);

        // let authSpy = sinon.spy(passport, 'authenticate');
        // sinon.assert.called(authSpy);

    });

});