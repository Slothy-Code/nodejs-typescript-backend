import {Server} from './system/server';
import {controllers} from './controllers/index';
import {DbConnector} from './system/dbConnector';
import {Authentication} from './system/authentication';


class Main {
    public static main() {
        const server = Server.getInstance();

        const database = DbConnector.getInstance();
        database.connect();

        const authentication = Authentication.getInstance();
        authentication.setAuthentication(server.getApp());

        server.bindControllers(controllers);
        server.bindSwagger();
    }
}

export default Main.main();
