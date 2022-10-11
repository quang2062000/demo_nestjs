import { IsString } from "class-validator";
export class UpdateProfileDto{
    @IsString()
    id:string;

    @IsString()
    email:string;

    @IsString()
    userName: string

    @IsString()
    password: string

    @IsString()
    role: string


}