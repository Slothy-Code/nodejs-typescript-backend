import 'mocha';
import * as sinon from 'sinon';
import * as httpMocks from 'node-mocks-http';
import * as cache from 'memory-cache';
import {cacheMiddleware} from '../../../system/middlewares/cache.middleware';

describe('Cache middleware', () => {
    const request = httpMocks.createRequest({originalUrl: '/test'});
    const response = httpMocks.createResponse();
    const responseSpy = sinon.spy(response, 'send');
    const nextSpy = sinon.spy();
    process.env.CACHE_DURATION = '30';

    afterEach(() => {
        cache.clear();
    })

    it('should load from cache if cache exists', () => {
        const content = {test: 'test'};
        cache.put(request.originalUrl, content, 30);

        cacheMiddleware(request, response, nextSpy);

        sinon.assert.calledWith(responseSpy, content);
    });

    it('should add to cache if cache doesnt exist', () => {
        const cachePutSpy = sinon.spy(cache, 'put');

        cacheMiddleware(request, response, nextSpy);

        response.send('test');
        sinon.assert.calledWith(cachePutSpy, request.originalUrl, 'test', 30);
        sinon.assert.calledWith(responseSpy, 'test');
        sinon.assert.called(nextSpy);
    })
});
