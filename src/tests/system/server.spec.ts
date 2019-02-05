import 'mocha';
import {expect} from 'chai';
import {Server} from '../../system/server';
import {Controller} from '../../system/decorators/controller';
import {Route} from '../../system/decorators/route';

@Controller('/test')
class ExampleController {
    @Route('/', 'get', 'test.test')
    public exampleFunction1() {
        console.log('test');
    }

    @Route('/', 'post')
    public exampleFunction2() {
        console.log('test');
    }

    @Route('/')
    public exampleFunction3() {
        console.log('test');
    }
}

describe('Server', () => {
    it('should return server instance', () => {
        expect(Server.getInstance()).to.be.an('object')
    });

    it('should bind controllers', () => {
        const server = Server.getInstance();
        server.bindControllers([ExampleController]);

        expect(server.getApp()._router.stack.find(e => e.regexp === '/^\\/api\\/test\\/?(?=\\/|$)/i')).to.not.equal(null);
    })
});
