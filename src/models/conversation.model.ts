import {UserModel} from './user.model';
import {MessageModel} from './message.model';

export interface ConversationModel {
    users: UserModel[];
    messages: MessageModel[];
}