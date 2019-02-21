import {Server} from './system/server';


class Main {
    public static main() {
        const server = new Server();
        server.listen();
    }
}

Main.main();