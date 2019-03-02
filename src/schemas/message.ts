import {Document, Model, model, Schema} from 'mongoose';
import {User} from './user';
import {MessageModel} from '../models/message.model';


export interface Message extends MessageModel, Document {
}

/**
 * @swagger
 * definition:
 *   MessageSchema:
 *     properties:
 *       sender:
 *         type: User
 *       test:
 *         type: string
 *         example: example message
 */
export const MessageSchema: Schema = new Schema({
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true}
}, {timestamps: {createdAt: 'created_at'}});

export const Message: Model<Message> = model<Message>('Message', MessageSchema);
