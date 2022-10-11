import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { User } from 'src/user/user.entity';
import { Car } from 'src/car/car.entity';
@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private res: Repository<Cart>,
        @InjectRepository(User) private resUser: Repository<User>,
        @InjectRepository(Car) private resCar: Repository<Car>,
    ) { }

    async findAllCart(email:string) {
        let user = await this.resUser.find({
            where:{email:email},relations: {
                carts:true
            }
        })
        // console.log(user[0].carts,"userrrr");
        let data = user[0].carts
        // let cart = await this.res.find({
        //     relations: {
        //         cars: true,
        //         users:true
        //     }
        // })
        return data
    }

    async createCart(body: any) {
        let car = await this.resCar.find({
            where: { id: body.carsId }
        })
        let user = await this.resUser.find({
            where: {id: body.usersId}
        })
        console.log(car, "carrrrrrrrrrr");
        let cart = await this.res.create({ price: car[0].price, amount: body.amount, color:car[0].color,img: car[0].img, description: car[0].nameCar, cars: car[0], users:user[0] })
        console.log(cart, "cartttt");
        return this.res.save(cart)
    }

    async deleteCart(data:any){
        let cart = await this.res.findOne({
            where:{id: data}
        })
        return this.res.remove(cart)
    }


    async updateCart(id:number,body:any){
        let car = await this.resCar.find({
            where: { id: id }
        })
        let updateCart = await this.res.update(id,{price: car[0].price, amount: body.amount, color:car[0].color,img: car[0].img, description: car[0].nameCar, cars: car[0]})
        return updateCart
    }
}
