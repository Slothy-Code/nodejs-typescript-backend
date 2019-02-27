import {User} from '../schemas/user';
import {Message} from '../schemas/message';

export interface ConversationModel {
    users: User[];
    messages: Message[];
}