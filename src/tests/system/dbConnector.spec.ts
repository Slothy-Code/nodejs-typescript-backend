// import 'mocha';
// import {expect} from 'chai';
// import {DbConnector} from '../../system/tools/dbConnector';
// import * as mongoose from 'mongoose';
// import * as sinon from 'sinon';
//
// describe('dbConnector', () => {
//     it('should return server instance', () => {
//         expect(DbConnector.getInstance()).to.be.an('object')
//     });
//
//     it('should return connection instance', () => {
//         const dbConnector = DbConnector.getInstance();
//         expect(dbConnector.getConnection()).to.be.an('object')
//     });
//
//     it('should connect to db', () => {
//         const dbConnector = DbConnector.getInstance();
//
//         const connect = sinon.spy(mongoose, 'connect');
//
//         dbConnector.connect();
//
//         sinon.assert.called(connect);
//
//         connect.restore();
//     })
//
//     it('shouldnt connect again if connection to db exists', () => {
//         const dbConnector = DbConnector.getInstance();
//
//         const connect = sinon.spy(mongoose, 'connect');
//
//         dbConnector.connect();
//         sinon.assert.notCalled(connect);
//
//         connect.restore();
//     })
// });
