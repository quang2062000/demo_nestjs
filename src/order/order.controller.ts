import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService){}

    @Get()
    getAllCart(@Query('email') email: string){
        return this.orderService.findAllOrder(email)
    }

    @Get('/findByStatus')
    getOrderByStatus(@Query('status') status: string,@Query('usersId') usersId: string){
        return this.orderService.findByStatus(status,parseInt(usersId))
    }

    @Post('/createOrder/:id')
    creatOrder(@Body() body: CreateOrderDto,@Param('id') id: string){
        // console.log(body,"bodyyyyyyy");
        const data = this.orderService.createOrder(body,parseInt(id))
        return data
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.orderService.deleteOrder(parseInt(id))
    }

    @Patch('/:id')
    updateCart(@Param('id') id: string, @Body() body:UpdateOrderDto){
        return this.orderService.updateOrder(parseInt(id),body)
    }

}
