import { IsString } from "class-validator";

export class ChangeRole{
    @IsString()
    role:string
}