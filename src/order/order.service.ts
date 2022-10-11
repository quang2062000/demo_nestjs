import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private resOrder: Repository<Order>,
        @InjectRepository(User) private resUser: Repository<User>,
        @InjectRepository(Cart) private resCart: Repository<Cart>,
    ) { }

    async findAllOrder(email:string){
        let dataUser = await this.resUser.find({
            where:{
                email:email
            },
            relations: {
                carts:true,
                orders:true
            }
        })
        let dataOrder = dataUser[0].orders
        return dataOrder
    }

    async findByStatus(status:string,usersId:number){
        console.log(status,"stauassss");
        
        let dataUser = await this.resUser.find({
            where:{
                id: usersId
            },
            relations:{
                carts:true,
                orders: true
            }
        })
        console.log(dataUser[0].carts,"bbbbbbbbbbbbbb");
        
        let array = []
        let arrayRes = []
        for(let i in dataUser){
            console.log(dataUser[i]);
            array = dataUser[i].orders
            for(let j in array){
                if(array[j].status == status){
                    arrayRes.push(array[j])
                }
            }
        }
        console.log(array,"array");
        
        return {arrayRes, dataUser}
    
    }



    async createOrder(body:any,cartsId:number){
        let dataCart = await this.resCart.find({
            where:{id: cartsId},
            relations: {
                users:true,
                orders:true
            }
        })
        // console.log(dataCart,"bbbbbbbbbbbbb");
        
        let createOrder = await this.resOrder.create({status:body.status,nameProduct:dataCart[0].description, sumPrice: body.sumPrice, address:body.address, phone: body.phone, img: dataCart[0].img, users: dataCart[0].users})
        return this.resOrder.save(createOrder)
    }

    async deleteOrder(ordersId:number){
        let deleteOrder = await this.resOrder.find({
            where:{id:ordersId}
        })
        return this.resOrder.remove(deleteOrder)
    }

    async updateOrder(ordersId:number, body:any){
        let dataOrder = await this.resOrder.update(ordersId,{status: body.status})
        return {messager: "update thành công"}
    }
}
