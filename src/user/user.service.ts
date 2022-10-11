import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {Like} from "typeorm";
require('dotenv').config()

import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { text } from 'stream/consumers';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private res: Repository<User>,
    ) { }


    // async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    //     const queryBuilder = this.res.createQueryBuilder('c');
    //     queryBuilder.orderBy('c.name', 'DESC'); // Or whatever you need to do

    //     return paginate<User>(queryBuilder, options);
    // }


    findOne(id: number) {
        if (!id) {
            return null
        }
        return this.res.findOne({
            where: { id: id }
        })

    }


    async findAllUser(activePage: number, limit:number){
        let data = await this.res.findAndCount({})
        let skip = (activePage - 1)* limit
        let totalPage = Math.ceil(data[1]/limit)
        let pagination =await this.res.find({skip: skip, take: limit,relations:{
            carts: true
        }})
        let arrayTotalPage:any = []
        for(let i=1; i<=totalPage;i++){
            arrayTotalPage.push(i)
        }
        return {pagination:pagination,totalPage:arrayTotalPage,skip:skip}
    }

    findByEmail(data: any) {
        return this.res.find({ where: { email: data.email},relations:{
            carts: true
        } })
    }

    async searchEmail(textSearch:string, activePage: number, limit: number){
        let skip = (activePage - 1)* limit
        let dataAllSearch = await this.res.findAndCount({where: { email: textSearch}})
        console.log(dataAllSearch,"dataAllSearch");
        let totalPage = Math.ceil(dataAllSearch[1]/limit)
        let dataPagination = await this.res.find({ where: { email: Like(`%${textSearch}%`)},skip: skip, take: limit ,relations:{
            carts: true
        }})
        console.log(dataPagination[0],"dataPagination");
        let arrayTotalPage:any = []
        for(let i=1; i<=totalPage;i++){
            arrayTotalPage.push(i)
        }
        return {dataPagination:dataPagination,totalPage:arrayTotalPage,activePage:activePage,skip:skip}

    }
    async create(body:any, file:any) {
        const url = `http://localhost:3000/`+ file.filename
        const emailData = await this.res.findOne({
            where: {
                email: body.email
            }
        })
        const userNameData = await this.res.findOne({
            where: {
                userName: body.userName
            }
        })
        if (emailData != null) {
            return {message: "email đã được sử dụng"}
            // throw new NotFoundException('email đã được sử dụng')
        }
        else {
            if (userNameData != null) {
                return {message: "tên người dùng đã được sử dụng"}
                // throw new NotFoundException('tên người dùng đã được sử dụng')
            }
            else {
                const hashedPassword = await bcrypt.hash(body.password, 10)
                const userCreate = await this.res.create({ email: body.email, password: hashedPassword, userName: body.userName, role: body.role,img:url})
                let save = this.res.save(userCreate)
                return {save, status: "đăng kí tài khoản thành công",url}
            }
        }
    }

    async signup(body:any) {
        const emailData = await this.res.findOne({
            where: {
                email: body.email
            }
        })
        const userNameData = await this.res.findOne({
            where: {
                userName: body.userName
            }
        })
        if (emailData != null) {
            return {message: "email đã được sử dụng"}
        }
        else {
            if (userNameData != null) {
                return {message: "tên người dùng đã được sử dụng"}
            }
            else {
                const hashedPassword = await bcrypt.hash(body.password, 10)
                const userCreate = await this.res.create({ email: body.email, password: hashedPassword, userName: body.userName, role: body.role,img:""})
                let save = this.res.save(userCreate)
                return {save, status: "đăng kí tài khoản thành công"}
            }
        }
    }
    async update(body:any,file:any) {
        const url = `http://localhost:3000/`+ file.filename
        let dataUser = await this.res.find({
            where:{userName: body.userName}
        })
        if(dataUser[0] === undefined){
            let data = await this.res.update(body.id,{email:body.email,password:body.password,role:body.role,userName: body.userName,img:url})
            return data
        }
        if(dataUser){
            if(dataUser[0].email = body.email){
                let data = await this.res.update(body.id,{email:body.email,password:body.password,role:body.role,userName: body.userName,img:url})
                return data
            }
            else{
                return {message: 'Tên người dùng đã được sử dụng!'}
            }
        }
    }

    async updateNoFile(body:any) {
       let dataEmail = await this.res.find({
        where:{email: body.email}
       })
        let dataUser = await this.res.find({
            where:{userName: body.userName}
        })
        if(dataUser[0] === undefined){
            let data = await this.res.update(body.id,{email:body.email,password:body.password,role:body.role,userName: body.userName,img:dataEmail[0].img})
            return data
        }
        if(dataUser != []){
            return {message: 'Tên người dùng đã được sử dụng!'}
        }
    }
    async remove(id: number) {
        const user = await this.res.findOne({
            where: { id: id }
        })

        if (!user) {
            throw new Error('khong tim thay nguoi dung')
        }
        this.res.remove(user)
    }

    async login(data: any) {
        const user = await this.res.findOne({
            where: {
                email: data.email
            }
        })
        if (!user) {
            return {message:"Tài khoản chưa tồn tại !!!"}
        }
        else {
            const comparePass = await bcrypt.compare(data.password, user.password)
            if (!comparePass) {
                return {message: "Mật khẩu không đúng"}
            }
            else {
                const token = jwt.sign(
                    { email: data.email, role: data.role },
                    '123',
                    {
                        expiresIn: '1d'
                    }
                )
                return { user, token, role: user.role, email: user.email,id: user.id}
            }

        }
    }


    async changeRole(id: number, changeRole: string) {
        const user = await this.res.findOne({
            where: { id: id }
        })
        if (!user) {
            throw new NotAcceptableException('khong tim thay user')

        }
        user.role = changeRole
        return this.res.save(user)
    }
}
