import {Controller} from '../system/decorators/controller';
import DIContainer from '../system/di-container';
import {Route} from '../system/decorators/route';
import {NextFunction, Request, Response} from 'express';
import {ChatService} from '../services/chat.service';
import {ChatUser} from '../interfaces/interfaces/chat-user';

@Controller('/chat')
export class ChatController {
    private chatService: ChatService = DIContainer.resolve<ChatService>(ChatService);

    private keepAliveHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    };

    @Route({route: '/join', permission: 'chat.join'})
    public join(req: Request, res: Response) {
        const user: ChatUser = {user: req.user, connection: res};
        try {
            res.writeHead(200, this.keepAliveHeaders);
            res.write('data: {"message": "connected"}\n\n')
            this.chatService.addUser(user);
        } catch (error) {
            res.status(500).json({'message': error})
        }
    }

    @Route({route: '/send', type: 'post', permission: 'chat.send'})
    public async send(req: Request, res: Response) {
        const receiver = req.body.receiver;
        const message = req.body.message;

        try {
            res.writeHead(200, this.keepAliveHeaders);
            res.write('data: {"state": "sent"}\n\n');

            // todo add to database
            this.chatService.sendMessage(req.user, receiver, message).then(() => {
                res.write('data: {"state": "received"}');
            }).catch(() => {
                res.write('data: {"state": "not received"}');
            });

            res.end();
        } catch (error) {
            res.status(500).json({'message': error})
        }
    }


}