import {UsersExistValidator} from './custom-validators/users-exist.validator';

export class CreateConversationDto {
    @UsersExistValidator()
    userIds: string[];
}