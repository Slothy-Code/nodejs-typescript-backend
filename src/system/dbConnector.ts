import * as mongoose from 'mongoose';
import {Logger} from './logger';

const logger = new Logger('Database', 'green');

export class DbConnector {
    private static instance: DbConnector;
    private readonly options;
    private readonly access;

    constructor() {
        this.options = {
            socketTimeoutMS: 30000,
            keepAlive: true,
            reconnectTries: 30000,
            useNewUrlParser: true
        };

        this.access = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.DB_NAME
        }
    }

    public static getInstance(): DbConnector {
        if (!DbConnector.instance) {
            DbConnector.instance = new DbConnector();
        }

        return DbConnector.instance;
    }

    public getConnection(): mongoose.Connection {
        return mongoose.connection;
    }

    public connect() {
        if (mongoose.connection.readyState) {
            logger.success('Connected successfully')
            return;
        }

        mongoose.connect('mongodb://' + this.access.user + ':' + this.access.password + '@' + this.access.host + ':' + this.access.port + '/' + this.access.name, this.options);
        mongoose.set('useFindAndModify', false);
        mongoose.connection.on('connected', () => {
            logger.success('Connected successfully')
        });

        mongoose.connection.on('error', (err) => {
            logger.error('Connection fail' + err)
        });

    }
}