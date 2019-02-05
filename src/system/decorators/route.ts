import {PermissionsMiddleware} from '../permissions/permissionsMiddleware';

export function Route({route, cached = false, type = 'get', permission}: { route: string, cached?: boolean, type?: string, permission?: string }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Object.defineProperty(target[propertyKey], 'route', {value: route});
        Object.defineProperty(target[propertyKey], 'cached', {value: cached});
        Object.defineProperty(target[propertyKey], 'type', {value: type});

        if (permission) Object.defineProperty(target[propertyKey], 'middleware', {value: PermissionsMiddleware.hasPermission(permission)});

    };
}