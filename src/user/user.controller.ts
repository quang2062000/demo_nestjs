import { UseGuards, Body, Controller, Delete, Get, Param, Patch, Post, Res, Session, UseInterceptors, NotFoundException, BadGatewayException, Query, DefaultValuePipe, ParseIntPipe, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { Response } from 'express';
import { CurrentUser } from '../user/decorators/current-user.decorator'
import { ChangeRole } from './dtos/changeRole.dto';
import { AuthGuard } from '../guards/auth.guards';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CreateUserDto } from './dtos/createUser.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from './dtos/pagination.dto';
import { AuthDto } from './dtos/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
@Controller('user')
// @UseInterceptors(CurrentUserInterceptor) // (2) truyền id vào đây đẻ tìm user
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    findAllUser(@Query('activePage') activePage: number, @Query('limit') limit: number){
        console.log(activePage, limit,"du lieu o controllerr");
        const data = this.userService.findAllUser(activePage, limit)
        return data
    }

    @Get('/search')
    searchEmail(@Query('textSearch') textSearch: string,@Query('activePage') activePage: number, @Query('limit') limit: number){
        const data = this.userService.searchEmail(textSearch,activePage,limit)
        return data
    }
    @Get('/:id')
    findById(@Param('id') id: string){
        const data = this.userService.findOne(parseInt(id))
        return data
    }
    @Post('/userName')
    getByEmail(@Body() body: string){
        console.log(body,"dl nhan dc");
        const data = this.userService.findByEmail(body)
        return data
    }

    @Get('/whoami')
    @UseGuards(AuthGuard) // (1) vào guard để lấy userId
    whoAmI(@CurrentUser() user: User) { // (3) đến currentUser để lấy ra được user từ session (4) đến controller
        console.log(user, "user controller");
        return user;
    }
    @Post('/signup')
    signup(@Body() body: CreateUserDto) {
        console.log(body,"du lieu nhan ben back");
        
        return this.userService.signup(body)
    }

    @Post('')
    // @UseGuards(AuthGuard)
    create(@Body() body: CreateUserDto, @CurrentUser() user: User) {
        // if(user.role === 'admin'){
        // return this.userService.create(body)
        // }
        // else{
        //     throw new BadGatewayException('bạn không có quyền thực hiện thao tác này!');
        // }
    }

    @Delete('/:id')
    // @UseGuards(AuthGuard)
    removeUser(@CurrentUser() user: User, @Param('id') id: string) {
        console.log(id, "du lieu nhan duoc");

        // if(user.role === 'admin'){
        return this.userService.remove(parseInt(id))

        // }
        // else{
        //     throw new BadGatewayException('bạn không có quyền thực hiện thao tác này!');
        // }

    }

  

    @Post('/signin')
    async login(@Body() body: AuthDto, @Res({ passthrough: true }) response: Response, @Session() session: any) {
        const data = await this.userService.login(body)
        // response.cookie('token', data, { httpOnly: true })
        // session.userId = data.user.id
        // console.log(session.userId, "session.userId");

        return {data}
    }

    @Post('/logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('token')
        return { message: 'success' }
    }

    @Patch('/changeRole/:id')
    // @UseGuards(AuthGuard)
    changeRole(@CurrentUser() user: User, @Param('id') id: string, @Body() body: ChangeRole) {
        console.log(user, "aaaaa");

        // if (user.role === 'admin') {
            let data = this.userService.changeRole(parseInt(id), body.role)
            return {data, message: "Thay đổi role thành công"}
        // }
        // else {
        //     return { message: "bạn không có quyền thực hiện thao tác này !" }
        // }
    }

    @Post('/uploadFile')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './img'
          ,  filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix  + '-' + file.originalname)
          }
        })
      }))
      async upload(@Body() body: CreateUserDto,@UploadedFile() file) {
        // console.log(body,file,"aaaaaaaaaaaaa");
        
        if(file){
            return this.userService.create(body,file)
        }
        else{
            return this.userService.signup(body)
        }
      }

      @Post('update-profile')
      // @UseGuards(AuthGuard)
      @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './img'
          ,  filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix  + '-' + file.originalname)
          }
        })
      }))
      udpateUser(@Body() body: UpdateProfileDto,@UploadedFile() file, @CurrentUser() user: User) {
          // if(user.role === 'admin'){
            console.log(body,file,"aaaaaaaaaaaaaab");
          if(file){
            return this.userService.update(body,file)
          }
          else{
            return this.userService.updateNoFile(body)
          }
          // }
          // else{
          //     throw new BadGatewayException('bạn không có quyền thực hiện thao tác này!');
          // }
      }
}
