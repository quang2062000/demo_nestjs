import { Controller, Get, Post, Patch, Query, Param, Delete, Body, UseInterceptors, UploadedFile, ParseFilePipeBuilder, Res, Header } from '@nestjs/common';
import { CreateCarDto } from './dtos/create-car.dto';
import { CarService } from './car.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FormDataDto } from './dtos/form_data.dto';
import * as XLSX from 'xlsx'
import { Response } from 'express';
import { UpdateProductDto } from './dtos/update-Produc.dto';
@Controller('car')
export class CarController {
    constructor(
        private carService: CarService
    ) { }

    @Post()
    createCar(@Body() body: CreateCarDto) {
        // const car = this.carService.create(body.nameCar, body.typeCar, body.color, body.price, body.amount)
        // return car
    }

    @Get()
    findAllCar(@Query('activePage') activePage: number, @Query('limit') limit: number) {
        return this.carService.findAllCar(activePage,limit)
    }

    @Get('/search')
    searchByName(@Query('activePage') activePage: number, @Query('limit') limit: number,@Query('textSearch') textSearch: string) {
        return this.carService.searchByName(activePage,limit,textSearch)
    }

    @Get('/:id')
    getCarById(@Param('id') id: string) {
        return this.carService.findById(parseInt(id))
    }

    @Delete('/:id')
    removeCar(@Param('id') id: string) {
        return this.carService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateCar(@Param('id') id: string, @Body() body: CreateCarDto) {
        // return this.carService.update(parseInt(id), body)
    }

    @Get('/searchName')
    findByName(@Query('nameCar') nameCar: string) {
        return this.carService.findByName(nameCar)
    }

    @Post('/uploads')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './img'
          ,  filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix  + '-' + file.originalname)
          }
        })
      }))
      async upload(@Body() body: FormDataDto, @UploadedFile() file) {
        console.log(file)
        const url = `http://localhost:3000/`+ file.filename
        return this.carService.create(body.nameCar,body.typeCar,body.color,parseInt(body.price),parseInt(body.amount),file)
      }

      @Post('/importExcel')
      @UseInterceptors(FileInterceptor('file', {
          storage: diskStorage({
            destination: './excel'
            ,  filename: function (req, file, cb) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
              cb(null,uniqueSuffix  + '-' + file.originalname)
            }
          })
        }))
        async imporExcel(@UploadedFile() file) {
          // console.log(file)
          let wookbook = XLSX.readFile(file.path,{type: 'buffer'})
          let sheet_list_name = wookbook.SheetNames
          let data = XLSX.utils.sheet_to_json(wookbook.Sheets[sheet_list_name[0]])
          console.log(data,"dataaaaas");
          return this.carService.importExcel(data)
        }

        @Post('/exportExcel')
        @Header('Content-Type','text/xlsx')
        async exportExcel(@Res() res: Response){
          let result = await this.carService.exportExcel()
          // console.log(__dirname,"resolveee");
          
          // res.download(`http://localhost:3001/car/exportExcel`+`${result}`)          
        }

        @Post('/updateproduct')
        @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
              destination: './img'
              ,  filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null,uniqueSuffix  + '-' + file.originalname)
              }
            })
          }))
          async updateProduct(@Body() body: UpdateProductDto, @UploadedFile() file) {
            console.log(body,file,"aaaaaaaaaaaaaaaaabccccccccc")
              return this.carService.update(parseInt(body.id),body.nameCar,body.typeCar,body.color,parseInt(body.price),parseInt(body.amount),file)
          }
}
