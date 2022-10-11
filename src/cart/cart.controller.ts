import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { UpdateCartDto } from './dtos/update-cart.dto';
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService){}

    @Get()
    getAllCart(@Query('email') email: string){
        return this.cartService.findAllCart(email)
    }

    @Post()
    creatCart(@Request() req){
        let body = req.body
        const data = this.cartService.createCart(body)
        return data
    }

    @Delete('/:id')
    deleteCart(@Param('id') id: string){
        return this.cartService.deleteCart(parseInt(id))
    }

    @Patch('/:id')
    updateCart(@Param('id') id: string, @Body() body:UpdateCartDto){
        // console.log(req.body,"reqqqqq");
        return this.cartService.updateCart(parseInt(id),body)
    }

}
