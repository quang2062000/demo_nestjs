import { Cart } from "src/cart/cart.entity";
import { User } from "src/user/user.entity";
import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nameProduct: string;

    @Column()
    sumPrice: number;

    @Column()
    address: string;

    @Column()
    phone: string;
    
    @Column()
    img: string;

    @Column()
    status: string;

    @OneToMany(() => Cart, (cart) => cart.orders)
    carts: Cart[]

    @ManyToOne(() => User, (user) => user.orders)
    users: User

}