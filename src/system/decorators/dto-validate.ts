import {DTOMiddleware} from '../middlewares/dto.middleware';

export function DTOValidate(dto: { new() }, skipMissingProperties = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Object.defineProperty(target[propertyKey], 'dtoMiddleware', {value: DTOMiddleware(dto, skipMissingProperties)});
    };
}