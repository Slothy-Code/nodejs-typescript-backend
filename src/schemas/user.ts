import {Document, Model, model, Schema} from 'mongoose';
import {UserModel} from '../models/user.model';
import {PermissionsUtil} from '../system/utils/permissionsUtil';

import * as bcrypt from 'bcryptjs';


export interface User extends UserModel, Document {
    getPermissions(): string[];

    hasPermission(permission: string): boolean;

    isValidPassword(password: string): boolean;
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
export const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true, select: false},
    role: {type: String, required: true, default: 'ROLE_USER'},
    permissions: [String],
});

UserSchema.pre('save', async function (next) {
    const user: any = this;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

UserSchema.methods.getPermissions = function (): string[] {
    return [...PermissionsUtil.getAllPermissions(this.role), ...this.permissions];
};

UserSchema.methods.hasPermission = function (permission: string): boolean {
    return PermissionsUtil.canAccess(this.getPermissions(), permission);
};

export const User: Model<User> = model<User>('User', UserSchema);
