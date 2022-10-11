import { IsNumber,IsString } from "class-validator";

export class UpdateOrderDto{
    @IsString()
    status:string;

}