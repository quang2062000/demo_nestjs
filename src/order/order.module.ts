import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/user/user.entity';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Cart,User]), 
],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
