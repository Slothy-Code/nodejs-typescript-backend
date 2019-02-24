import {permissionMiddleware} from '../middlewares/permission.middleware';
import {cacheMiddleware} from '../middlewares/cache.middleware';

interface RouteDataModel {
    route: string;
    cached?: boolean;
    type?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    permission?: string;
}

export function Route({route, cached = false, type = 'get', permission}: RouteDataModel) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Object.defineProperty(target[propertyKey], 'route', {value: route});
        Object.defineProperty(target[propertyKey], 'type', {value: type});

        const middlewares = [];
        if (permission) middlewares.push(permissionMiddleware(permission));
        if (cached) middlewares.push(cacheMiddleware);

        Object.defineProperty(target[propertyKey], 'middlewares', {value: middlewares});
    };
}
