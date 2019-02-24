import {injectable} from 'inversify';
import 'reflect-metadata';
import {ChatUser} from '../interfaces/chat-user';
import {User} from '../schemas/user';
import {Conversation} from '../schemas/conversation';
import {Message} from '../schemas/message';

@injectable()
export class ChatService {
    public activeUsers: ChatUser[] = [];

    public addUser(user: ChatUser) {
        this.activeUsers.push(user);
        user.connection.on('close', () => {
            this.activeUsers = this.activeUsers.filter(e => e !== user);
        });
    }

    public async sendMessage(sender: User, conversation: Conversation, text: string) {
        const message = await new Message({sender: sender, text: text}).save();
        conversation.addMessage(message);
        this.sendNewMessageToActiveUsers(conversation);
    }

    public sendNewMessageToActiveUsers(conversation: Conversation) {
        for (const user of conversation.users) {
            const activeUser = this.activeUsers.find(activeUser => activeUser.user['_id'] === user['_id'])
            activeUser.connection.write(conversation);
        }
    }

}