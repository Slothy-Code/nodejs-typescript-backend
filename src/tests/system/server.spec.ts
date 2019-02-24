import 'mocha';
import {Controller} from '../../system/decorators/controller';
import {Route} from '../../system/decorators/route';
import {Server} from '../../system/server';
import * as spdy from 'spdy';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';


@Controller('/test')
class ExampleController {
    @Route({route: '/', type: 'get', permission: 'test.test'})
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

describe('Server', () => {
    const server = new Server();
    const appListenStub = sinon.stub(server.app, 'listen');

    after((done) => {
        mongoose.connection.close(done);
    });


    it('should run ssl server if config says run ssl', () => {
        process.env.USE_SSL = 'true';
        const spdyStub = sinon.stub(spdy, 'createServer');
        spdyStub.returns({
            listen: () => {
            }
        });

        server.listen();

        sinon.assert.called(spdyStub);
    })

    it('should run standard server if config says run standard', () => {
        process.env.USE_SSL = 'false';
        server.listen();

        sinon.assert.called(appListenStub);
    })
});
