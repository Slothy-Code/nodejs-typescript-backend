import 'mocha';
import {expect} from 'chai';
import {DbConnector} from '../../../system/tools/db-connector';

describe('dbConnector', () => {
    const dbConnector = new DbConnector();

    after(() => {
        dbConnector.getConnection().close();
    })

    it('should open connection', () => {
            dbConnector.connect();
            expect(dbConnector.getConnection().readyState).to.eq(2);
        }
    )
});
