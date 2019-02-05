import {injectable} from 'inversify';
import 'reflect-metadata';
import {ChatUser} from '../interfaces/interfaces/chat-user';
import {UserModel} from '../interfaces/models/user.model';

@injectable()
export class ChatService {
    public activeUsers: ChatUser[] = [];

    public addUser(user: ChatUser) {
        this.activeUsers.push(user);
        user.connection.on('close', () => {
            this.activeUsers = this.activeUsers.filter(e => e !== user);
        });
    }

    public async sendMessage(sender: UserModel, receiver: string, message: string) {
        return new Promise((resolve, reject) => {
            const receiverUser: ChatUser = this.activeUsers.find(user => user.user['_id'] === receiver);
            if (!receiverUser) reject();
            receiverUser.connection.write(`data: {"sender": "${sender['_id']}", "message": "${message}"}\n\n`, () => {
                resolve();
            });
        })
    }


}