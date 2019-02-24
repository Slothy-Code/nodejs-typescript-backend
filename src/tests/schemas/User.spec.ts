import 'mocha';
import {expect} from 'chai';
import {User} from '../../schemas/user';
import * as permissionsConfig from '../../permissions.json'

describe('User schema', () => {
    it('should return all permissions', () => {
        const expectedPermissions = permissionsConfig.find(e => e.name === 'ROLE_USER').permissions;

        const user = new User();

        expect(user.getPermissions()).to.eql(expectedPermissions);

    });

    it('should return true if user has permission', () => {
        const expectedPermissions = permissionsConfig.find(e => e.name === 'ROLE_USER').permissions;

        const user = new User();

        expect(user.hasPermission(expectedPermissions[0])).to.be.true;

    });
});
