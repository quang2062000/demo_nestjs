import { IsNumber,IsString } from "class-validator";

export class CreateOrderDto{

    @IsNumber()
    sumPrice: number

    @IsString()
    address:string;

    @IsString()
    phone:string;

    @IsString()
    status:string;

}