import {Controller} from '../system/decorators/controller';
import DIContainer from '../system/dependency-injection/di-container';
import {Route} from '../system/decorators/route';
import {NextFunction, Request, Response} from 'express';
import {ChatService} from '../services/chat.service';
import {ChatUser} from '../interfaces/chat-user';
import {Conversation} from '../schemas/conversation';
import {DTOValidate} from '../system/decorators/dto-validate';
import {ChatSendDto} from '../DTO/chat-send.dto';

@Controller('/chat')
export class ChatController {
    private chatService: ChatService = DIContainer.resolve<ChatService>(ChatService);

    private keepAliveHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    };

    @Route({route: '/conversations', permission: 'chat.getConversations'})
    public async getConversations(req: Request, res: Response, next: NextFunction) {
        const usersConversations = await Conversation.find({users: req.user}).populate('users', 'name');
        res.status(200).json(usersConversations);
    }

    @Route({route: '/conversations', type: 'put', permission: 'chat.createConversation'})
    public async createConversation(req: Request, res: Response, next: NextFunction) {
        const conversation = await new Conversation({users: [req.user]}).save();
        res.status(200).json(conversation);
    }

    @Route({route: '/listen', permission: 'chat.join'})
    public join(req: Request, res: Response) {
        const user: ChatUser = {user: req.user, connection: res};
        res.writeHead(200, this.keepAliveHeaders);
        res.write('data: {"message": "connected"}\n\n')
        this.chatService.addUser(user);
    }

    @DTOValidate(ChatSendDto)
    @Route({route: '/send', type: 'post', permission: 'chat.send'})
    public async send(req: Request, res: Response) {
        const body: ChatSendDto = req.body;
        const sender = req.user;
        const conversation: Conversation = await Conversation.findById(req.body.conversation);
        await this.chatService.sendMessage(sender, conversation, body.text);

        res.status(200).json(conversation)
    }


}