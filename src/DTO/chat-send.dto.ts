import {MinLength} from 'class-validator';

export class ChatSendDto {

    @MinLength(3)
    conversation: string;

    @MinLength(1)
    text: string;

}