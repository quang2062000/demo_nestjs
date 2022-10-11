import { Entity,Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Cart } from "src/cart/cart.entity";
import { Order } from "src/order/order.entity";
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email:string;

    @Column()
    userName:string;

    @Column()
    password:string;

    @Column({enum:['user','admin','manager'],default:'user'})
    role: string

    @Column()
    img:string;

    @OneToMany(() => Cart, (cart) => cart.users)
    carts: Cart[]

    @OneToMany(() => Order, (order) => order.users)
    orders: Cart[]
}