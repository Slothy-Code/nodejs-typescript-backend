import * as roles from '../../permissions.json';

export class PermissionsUtil {

    public static getAllPermissions(role: string) {
        const permissions = [];
        const sRole = roles.find(e => e.name === role);
        for (let baseRole of sRole.extends) {
            permissions.push(...PermissionsUtil.getAllPermissions(baseRole));
        }
        permissions.push(...sRole.permissions);
        return permissions;
    }

    public static canAccess(permissions: string[], requiredPermission: string) {
        if (permissions.indexOf(requiredPermission) !== -1) return true;
        const splitted = requiredPermission.split('.');
        let permissionChecked = '';
        for (let fragment of splitted) {
            if (permissions.indexOf(permissionChecked + '*') !== -1) return true;
            permissionChecked += fragment + '.';
        }
        return false;
    }
}
