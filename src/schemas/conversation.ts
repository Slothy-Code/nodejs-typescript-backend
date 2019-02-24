import {Document, Model, model, Schema} from 'mongoose';
import {ConversationModel} from '../models/conversation.model';
import {Message} from './message';


export interface Conversation extends ConversationModel, Document {
    addMessage(message: Message): void;
}

/**
 * @swagger
 * definition:
 *   ConversationSchema:
 *     properties:
 *       users:
 *         type: User
 *       messages:
 *         type: Message
 */
const ConversationSchema: Schema = new Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

ConversationSchema.methods.addMessage = async function (message: Message) {
    this.messages.push(message);
    await this.save();
};
//
// UserSchema.methods.hasPermission = function (permission: string): boolean {
//     return PermissionsUtil.canAccess(this.getPermissions(), permission);
// };
//
export const Conversation: Model<Conversation> = model<Conversation>('Conversation', ConversationSchema);
