import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx'
import {Like} from "typeorm";
@Injectable()
export class CarService {
    constructor(@InjectRepository(Car) private res:Repository<Car>){}

    create(nameCar:string, typeCar:string, color:string, price: number, amount: number,file:any){
        const url = `http://localhost:3000/`+ file.filename
        const car = this.res.create({nameCar,typeCar, color,price,amount,img:url})
        let save = this.res.save(car)
        return {save,car}
    }

    async findAllCar(activePage:number, limit:number){
        let data = await this.res.findAndCount({})
        let skip = (activePage - 1)* limit
        let totalPage = Math.ceil(data[1]/limit)
        let pagination =await this.res.find({skip: skip, take: limit,relations:{
            carts: true
        }})
        console.log(pagination,"pagination");
        
        let arrayTotalPage:any = []
        for(let i=1; i<=totalPage;i++){
            arrayTotalPage.push(i)
        }
        return {pagination:pagination,totalPage:arrayTotalPage,skip:skip}
    }

    async findById(id:number){
        let data = await this.res.find({
            where:{id:id}
        })
        return data
    }

    async searchByName(activePage:number,limit:number,textSearch:string){
        let skip = (activePage - 1)* limit
        let dataAllSearch = await this.res.findAndCount({where: { nameCar: Like(`%${textSearch}%`)},relations:{
            carts: true
        }})
        console.log(dataAllSearch,"dataAllSearch");
        let totalPage = Math.ceil(dataAllSearch[1]/limit)
        let dataPagination = await this.res.find({ where: {nameCar: Like(`%${textSearch}%`)},skip: skip, take: limit,relations:{
            carts: true
        } })
        console.log(dataPagination[0],"dataPagination");
        let arrayTotalPage:any = []
        for(let i=1; i<=totalPage;i++){
            arrayTotalPage.push(i)
        }
        return {dataPagination:dataPagination,totalPage:arrayTotalPage,activePage:activePage,skip:skip}
    }


    async remove(id:number){
        const car = await this.res.findOne({
            where:{id:id}
        })
        if(!car){
            throw new NotFoundException('car not foundddd')
        }
        return this.res.remove(car)
    }

    async update(id:number,nameCar:string, typeCar:string, color:string, price: number, amount: number, file:any){
        if(file){
            const url = `http://localhost:3000/`+ file.filename
            let dataUpdateCar = await this.res.update(id,{nameCar:nameCar, typeCar: typeCar, color: color, price: price,amount:amount, img: url})
            return {dataUpdateCar,message:"Update success!!!"}
        }
        else{
            console.log("da vao elseee");
            
            const car = await this.res.findOne({
                where:{id:id}
            })
            console.log(car.img,"carrr");
            
            let dataUpdateCar = await this.res.update(id,{nameCar:nameCar, typeCar: typeCar, color: color, price: price,amount:amount, img: car.img})
            return {dataUpdateCar,message:"Update success!!!"}
        }

        
    }

    findByName(nameCar:string){
        return this.res.find({
            where:{nameCar: nameCar}
        })

    }

    async importExcel(data:any){
        let car:any
        for(let i in data){
            car = await this.res.create({nameCar:data[i].nameCar,typeCar:data[i].typeCar,color:data[i].color,price:data[i].price,amount:data[i].amount,img:''})
        }
        return this.res.save(car)
    }

    async exportExcel(){
        let data = await this.res.find({})

        let rows =[]
        data.forEach(doc =>{
            rows.push(Object.values(doc))
        })

        let book = new Workbook()

        let sheet = book.addWorksheet('sheet1')

        rows.unshift(Object.keys(data[0]))

        sheet.addRows(rows)


        // let File = await new Promise((resolve, reject)=>{
        //     tmp.file({discardDescriptor: true, prefix: `MyExcelSheet`, postfix:'.xlsx',mode: parseInt('0600,8')}, async (err,file) => {
        //         if(err) {
        //             throw new BadRequestException(err)
        //         }
        //         book.xlsx.writeFile(file).then(_=>{
        //             resolve(file)
        //         }).catch(err=>{
        //             throw new BadRequestException(err)
        //         })
        //     })
        // })

        let ws = XLSX.utils.json_to_sheet(data)
        let wb = {Sheets: {data:ws}, SheetNames:['data']}
        XLSX.writeFileXLSX(wb,'excel_car.xlsx')
        // return File
        
    }
}
