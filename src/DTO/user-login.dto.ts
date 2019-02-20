import {MinLength} from 'class-validator';


export class UserLoginDto {
    @MinLength(6)
    name: string;

    @MinLength(6)
    password: string
}