import 'mocha';
import {Controller} from '../../system/decorators/controller';
import {Route} from '../../system/decorators/route';

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
    // it('should return server instance', () => {
    // });

    // it('should bind controllers', () => {
    //     server.bindControllers([ExampleController]);
    //
    //     expect(server.getApp()._router.stack.find(e => e.regexp === '/^\\/api\\/test\\/?(?=\\/|$)/i')).to.not.equal(null);
    // })
});
