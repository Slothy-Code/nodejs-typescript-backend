import {UserModel} from '../models/user.model';
import {Response} from 'express';

export interface ChatUser {
    user: UserModel;
    connection: Response;
}