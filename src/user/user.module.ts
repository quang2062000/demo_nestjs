import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports:[TypeOrmModule.forFeature([User]), 
],
  controllers: [UserController],
  providers: [UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor // đây là dùng interceptor phạm vi toàn cầu
     }],
  exports: [UserService]
})
export class UserModule {}
