import * as express from 'express';
import * as spdy from 'spdy';
import * as fs from 'fs';
import * as swaggerConfig from './swagger.config.json';
import {Logger} from './logger';

const bodyParser = require('body-parser');
const responseTime = require('response-time');
const cors = require('cors');

// load environment variables
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const logger = new Logger('Server', 'red');

export class Server {
    private static instance: Server;
    private static app: express.Application;
    private readonly options: {key: Buffer, cert: Buffer} = {key: null, cert: null};

    constructor() {
        this.options.key = fs.readFileSync(__dirname + '/certificates/key.pem');
        this.options.cert = fs.readFileSync(__dirname + '/certificates/cert.pem');

        Server.app = express();
        Server.app.use(bodyParser.urlencoded({extended: true}));
        Server.app.use(bodyParser.json());
        Server.app.use(responseTime());
        Server.app.use(cors());
        spdy.createServer(this.options, Server.app).listen(process.env.PORT, () => {
            logger.success('Server is listening on port ' + process.env.PORT)
        });
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public getApp(): express.Application {
        return Server.app;
    }

    public bindControllers(controllers) {
        for (let c of controllers) {
            const controller = new c();
            Server.app.use('/api' + controller.getPath(), controller.getRouter());
        }
    }

    public bindSwagger() {
        Server.app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerConfig)));
    }
}
