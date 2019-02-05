import 'mocha';
import {expect} from 'chai';
import {PermissionsUtil} from '../../../system/permissions/permissionsUtil';
import * as permissions from '../../../permissions.json';

describe('Permissions util', () => {
    it('should show all permissions for role ROLE_USER', () => {
        const rolePermissions = PermissionsUtil.getAllPermissions('ROLE_USER');
        const expectedPermissions = permissions.find(e => e.name === 'ROLE_USER').permissions;
        expect(rolePermissions).to.eql([...expectedPermissions]);
    });

    it('should show all permissions for role ROLE_PREMIUM', () => {
        const rolePermissions = PermissionsUtil.getAllPermissions('ROLE_PREMIUM');
        const expectedPermissions = [...permissions.find(e => e.name === 'ROLE_USER').permissions, ...permissions.find(e => e.name === 'ROLE_PREMIUM').permissions];
        expect(rolePermissions).to.eql([...expectedPermissions]);
    });

    it('should return true if when checked permission is "user.create" and list is ["user.*"]', () => {
        const permission = 'user.create';
        const permissionsList = ['user.*']
        expect(PermissionsUtil.canAccess(permissionsList, permission)).to.be.true;
    });

    it('should return true if when checked permission is "user.create" and list is ["*"]', () => {
        const permission = 'user.create';
        const permissionsList = ['*']
        expect(PermissionsUtil.canAccess(permissionsList, permission)).to.be.true;
    });

    it('should return true if when checked permission is "user.create" and list is ["user.create"]', () => {
        const permission = 'user.create';
        const permissionsList = ['user.create']
        expect(PermissionsUtil.canAccess(permissionsList, permission)).to.be.true;
    });

    it('should return false if when checked permission is "user.create" and list is ["test.test"]', () => {
        const permission = 'user.create';
        const permissionsList = ['test.test']
        expect(PermissionsUtil.canAccess(permissionsList, permission)).to.be.false;
    });

});