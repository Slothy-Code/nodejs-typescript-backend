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
        await conversation.addMessage(message);
        await this.updateConversationToActiveUsers(conversation);
    }

    public async updateConversationToActiveUsers(conversation: Conversation) {
        for (const user of conversation.users) {
            const activeUser = this.activeUsers.find(activeUser => {
                return activeUser.user._id.equals(user._id);
            });
            const payload = await Conversation.findById(conversation._id).populate({
                path: 'messages',
                options: {limit: 1, sort: {created_at: -1}}
            })
            if (activeUser) {
                activeUser.connection.write(`data: ${JSON.stringify(payload)}\n\n`);
            }
        }
    }
}