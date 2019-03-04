import {User} from '../../schemas/user';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import * as mongoose from 'mongoose';

@ValidatorConstraint({async: true})
export class UsersExistConstraint implements ValidatorConstraintInterface {

    async validate(userIds: string[], args: ValidationArguments) {
        for (const id of userIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) return false;

            const user = await User.findById(id);
            if (!user) return false;
        }
        return true
    }

}

export function UsersExistValidator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UsersExistConstraint
        });
    };
}