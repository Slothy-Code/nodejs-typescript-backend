import {UserModel} from './user.model';

export interface MessageModel {
    sender: UserModel;
    text: string;
    sendAt: number;
}