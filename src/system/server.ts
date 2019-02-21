import * as express from 'express';
import * as spdy from 'spdy';
import * as fs from 'fs';
import {Logger} from './tools/logger';
import * as path from 'path';
import {controllers} from '../controllers';
import {Authentication} from './tools/authentication';
import {DbConnector} from './tools/dbConnector';
import swaggerConfig from './swagger.config';
import {errorMiddleware} from './middlewares/error.middleware';

const bodyParser = require('body-parser');
const responseTime = require('response-time');
const cors = require('cors');

// load environment variables
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const logger = new Logger('Server', 'red');

export class Server {
    private app: express.Application;
    private authentication: Authentication;
    private dbConnector: DbConnector;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(responseTime());
        this.app.use(cors());

        this.authentication = new Authentication(this.app);
        this.connectToDB();
        this.bindControllers();
        this.bindSwagger();
        this.initializeErrorHandling();
    }

    public listen() {
        if (process.env.USE_SSL === 'true') {
            this.runSSLServer();
            return;
        }
        this.runStandardServer();
    }

    private bindControllers() {
        for (let c of controllers) {
            const controller = new c();
            const path = process.env.BASE_HREF + controller.getPath();
            const pathWithoutDoubleSlash = path.replace('//', '/');
            this.app.use(pathWithoutDoubleSlash, controller.getRouter());
        }
    }

    private bindSwagger() {
        if (process.env.PROD === 'true') return;
        this.app.use(process.env.SWAGGER_HREF, swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerConfig)));
    }

    private runSSLServer() {
        const options = {key: null, cert: null};
        options.key = fs.readFileSync(path.resolve(__dirname, '../../' + process.env.PRIVKEY_PATH));
        options.cert = fs.readFileSync(path.resolve(__dirname, '../../' + process.env.CERT_PATH));
        spdy.createServer(options, this.app).listen(+process.env.PORT, process.env.HOST, () => {
            logger.success('HTTPS server is listening on ' + process.env.HOST + ':' + process.env.PORT)
        });
    }

    private runStandardServer() {
        this.app.listen(+process.env.PORT, process.env.HOST, () => {
            logger.success('Server is listening on ' + process.env.HOST + ':' + process.env.PORT);
        });
    }

    private connectToDB() {
        this.dbConnector = new DbConnector();
        this.dbConnector.connect();
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}
