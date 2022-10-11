import { Cart } from "src/cart/cart.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nameCar: string;

    @Column()
    typeCar: string;

    @Column()
    color: string;

    @Column()
    price: number;

    @Column()
    amount: number;

    @Column({ array: true })
    img: string;


    @OneToMany(() => Cart, (cart) => cart.cars)
    carts: Cart[]
}