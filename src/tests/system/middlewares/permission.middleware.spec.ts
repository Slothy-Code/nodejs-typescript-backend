import 'mocha';
import * as sinon from 'sinon';
import {permissionMiddleware} from '../../../system/middlewares/permission.middleware';
import * as passport from 'passport';
import * as httpMocks from 'node-mocks-http';
import {HttpException} from '../../../system/exceptions/http-exception';

describe('Permissions middleware', () => {
    const middleware = permissionMiddleware('user.create');
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const nextSpy = sinon.spy();
    let authStub = null;

    afterEach(() => {
        authStub.restore();
    })

    it('should pass if user has permission', () => {
        authStub = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
            callback(null, {'token': 'testToken', 'hasPermission': () => true}, null);
            return (req, res, next) => {
            };
        });

        middleware(request, response, nextSpy);
        sinon.assert.called(nextSpy);
    });
    it('should not pass if user has not required permission', () => {
        authStub = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
            callback(null, {'token': 'testToken', 'hasPermission': () => false}, null);
            return (req, res, next) => {
            };
        });

        middleware(request, response, nextSpy);

        sinon.assert.calledWith(nextSpy, sinon.match.instanceOf(HttpException));

    });

    it('should not pass if token expired', () => {
        authStub = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
            callback(null, null, {name: 'TokenExpiredError'});
            return (req, res, next) => {
            };
        });

        middleware(request, response, nextSpy);

        sinon.assert.calledWith(nextSpy, sinon.match.instanceOf(HttpException));
    });

    it('should not pass if another auth error', () => {
        authStub = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
            callback(null, null, {name: 'NoTokenError'});
            return (req, res, next) => {
            };
        });

        middleware(request, response, nextSpy);

        sinon.assert.calledWith(nextSpy, sinon.match.instanceOf(HttpException));
    });

});
