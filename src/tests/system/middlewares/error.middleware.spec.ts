import 'mocha';
import * as sinon from 'sinon';
import {errorMiddleware} from '../../../system/middlewares/error.middleware';
import {HttpException} from '../../../system/exceptions/http-exception';
import * as httpMocks from 'node-mocks-http';

describe('DTO Middleware', () => {

    it('should handle error', async () => {
        const error = new HttpException(500, 'test');
        const response = httpMocks.createResponse();

        const responseJsonSpy = sinon.spy(response, 'json');
        const responseStatusSpy = sinon.spy(response, 'status');
        const nextSpy = sinon.spy();

        errorMiddleware(error, httpMocks.createRequest(), response, nextSpy);

        sinon.assert.calledWith(responseStatusSpy, 500);
        sinon.assert.calledWith(responseJsonSpy, {status: 500, message: 'test'});
    });

    it('should handle error on production', async () => {
        process.env.PROD = 'true';
        const error = new HttpException(500, 'test');
        const response = httpMocks.createResponse();

        const responseJsonSpy = sinon.spy(response, 'json');
        const responseStatusSpy = sinon.spy(response, 'status');
        const nextSpy = sinon.spy();

        errorMiddleware(error, httpMocks.createRequest(), response, nextSpy);

        sinon.assert.calledWith(responseStatusSpy, 500);
        sinon.assert.calledWith(responseJsonSpy, {status: 500, message: 'Something went wrong'});
    });

});