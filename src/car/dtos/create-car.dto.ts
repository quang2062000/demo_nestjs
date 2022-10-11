import { IsString,IsNumber } from "class-validator";
export class CreateCarDto{
    @IsString()
    nameCar:string;

    @IsString()
    typeCar: string

    @IsString()
    color:string;

    @IsNumber()
    price: number;

    @IsNumber()
    amount: number;
}