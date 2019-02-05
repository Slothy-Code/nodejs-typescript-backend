import {Document, Model, model, Schema} from 'mongoose';
import {UserModel} from '../models/user.model';
import {PermissionsUtil} from '../../system/permissions/permissionsUtil';

interface User extends UserModel, Document {
    getPermissions(): string[];

    hasPermission(permission: string): boolean;
}

/**
 * @swagger
 * definition:
 *   UserSchema:
 *     properties:
 *       name:
 *         type: string
 *         example: admin123
 *       password:
 *         type: string
 *         example: admin123
 */
const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true, select: false},
    role: {type: String, required: true, default: 'ROLE_USER'},
    permissions: [String],
    token: {type: String}
});

UserSchema.methods.getPermissions = function (): string[] {
    return [...PermissionsUtil.getAllPermissions(this.role), ...this.permissions];
};

UserSchema.methods.hasPermission = function (permission: string): boolean {
    return PermissionsUtil.canAccess(this.getPermissions(), permission);
};


export const User: Model<User> = model<User>('User', UserSchema);
