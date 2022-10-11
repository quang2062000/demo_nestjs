import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Car } from "src/car/car.entity";
import { User } from "src/user/user.entity";
import { Order } from "src/order/order.entity";
@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    price: number;

    @Column()
    amount: number;

    @Column()
    color: string;

    @Column()
    img: string;

    @Column()
    description: string;

    @ManyToOne(() => Car, (car) => car.carts)
    cars: Car

    @ManyToOne(() => User, (user) => user.carts)
    users: User
    
    @ManyToOne(() => Order, (order) => order.carts)
    orders: Order
}