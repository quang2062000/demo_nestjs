import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { Car } from './car/car.entity';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Cart } from './cart/cart.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'sqlite',
    database:'db.sqlite',
    entities:[Car,User,Cart,Order],
    synchronize:true,
    autoLoadEntities: true
  }),CarModule, UserModule, CartModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'img'), // hiển thị url ảnh trên web
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'excel'), // hiển thị url ảnh trên web
  }),
  OrderModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
