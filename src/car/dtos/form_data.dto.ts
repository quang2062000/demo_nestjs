import { IsString,IsNumber } from "class-validator";
export class FormDataDto{
    @IsString()
    nameCar:string;

    @IsString()
    typeCar: string

    @IsString()
    color:string;

    @IsString()
    price: string;

    @IsString()
    amount: string;
}