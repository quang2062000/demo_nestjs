import { IsNumber } from "class-validator";
// import { User } from "src/user/user.entity";
export class CreateCartDto{
    @IsNumber()
    price:number;

    @IsNumber()
    amount: number

    // users: User

    
}