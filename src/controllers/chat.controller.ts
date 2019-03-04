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
        const usersConversations = await Conversation.find({users: req.user})
            .populate('users', 'name')
            .populate({path: 'messages', options: {limit: 1, sort: {created_at: -1}}});
        res.status(200).json(usersConversations);
    }

    @Route({route: '/conversations/:id', permission: 'chat.getSingleConversation'})
    public async getConversation(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const page = req.query.page || 1;
        const itemsPerPage = 20;

        const conversation = await Conversation.findById(id)
            .populate('users', 'name')
            .populate({
                path: 'messages',
                options: {skip: (page - 1) * itemsPerPage, limit: itemsPerPage, sort: {created_at: -1}}
            });
        res.status(200).json(conversation);
    }

    @Route({route: '/conversations', type: 'post', permission: 'chat.createConversation'})
    public async createConversation(req: Request, res: Response, next: NextFunction) {
        //todo add another users
        const conversation = await new Conversation({users: [req.user]}).save();
        res.status(200).json(conversation);
    }

    @Route({route: '/listen', permission: 'chat.join'})
    public join(req: Request, res: Response) {
        const user: ChatUser = {user: req.user, connection: res};
        res.writeHead(200, this.keepAliveHeaders);
        this.chatService.addUser(user);
    }

    @DTOValidate(ChatSendDto)
    @Route({route: '/send-message', type: 'post', permission: 'chat.sendMessage'})
    public async send(req: Request, res: Response) {
        const body: ChatSendDto = req.body;
        const sender = req.user;
        const conversation: Conversation = await Conversation.findById(req.body.conversation);
        await this.chatService.sendMessage(sender, conversation, body.text);

        res.status(200).json(conversation)
    }


}