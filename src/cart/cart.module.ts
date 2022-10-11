import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/car/car.entity';
import { CarModule } from 'src/car/car.module';
import { User } from 'src/user/user.entity';

import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,User,Car])],
  controllers: [CartController],
  providers: [CartService],
  // imports:[CarModule]
})
export class CartModule {}
