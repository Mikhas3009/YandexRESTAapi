import { Controller,Get,Query, Param, Post, Body, ParseIntPipe} from '@nestjs/common';
import { CourierService } from './courier.service';
import { CreateCourierDto } from './courier.dto';
import { QueryValidationPipe } from 'src/global-validation/query-params-validation';
import { DateDto } from 'src/global-validation/dateValidation';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation,ApiParam,ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CourierModel } from 'src/models/courier/courier-model';
import { OrderModel } from 'src/models/order/order-model';

@Throttle(10, 1)
@Controller('')
export class CourierController {

    constructor(private courierService: CourierService){}

    @ApiOperation({summary:"Получение всех курьеров"})
    @ApiQuery({ name: 'offset', description: 'Id курьера с которого нужно сделать выгрузку' })
    @ApiQuery({ name: 'limit', description: 'Лимит курьеров которых вы хотите вывести' })
    @ApiResponse({status:200, type: [CourierModel]})
    @Get('/couriers')
    async getCouriers(@Query('offset',QueryValidationPipe)offset,@Query('limit',QueryValidationPipe)limit){
        try{
            return await this.courierService.getAllCouriers(offset,limit);
        }
        catch(err){ 
            return err;
        }
    }

    @ApiResponse({status:200, type: [OrderModel]})
    @ApiOperation({summary:"Получение распределенных заказов"})
    @Get('/couriers/assigments')
    async getAssignmentOrders(){
        try{
            return await this.courierService.getAssigmentOrders()
        }
        catch(err){
            console.log(err)
            return err;
        }
    }

    @ApiOperation({summary:"Получение курьера по Id"})
    @ApiParam({name:"id",description:"Id курьера, которого хотите вывести"})
    @ApiResponse({status:200, type: CourierModel})
    @Get('/couriers/:id')
    async getCourier(@Param('id',ParseIntPipe)id){
        try{
            return await this.courierService.getUserById(id);
        }
        catch(err){
            return err;
        }
    }

    @ApiOperation({summary:"Добавление курьера"})
    @ApiResponse({status:201, type: CourierModel})
    @Post('/couriers')
    async addCourier(@Body()courier:CreateCourierDto){
        try{
            return await this.courierService.createCourier(courier)
        }
        catch(err){
            return err;
        }
    }

    @ApiOperation({summary:"Получение аналитики по курьеру"})
    @ApiParam({name:"id",description:"Id курьера по которому хотите собрать аналитику"})
    @ApiQuery({ name: 'start_date', description: 'начальный диапазон' })
    @ApiQuery({ name: 'end_date', description: 'Конечный диапазон' })
    @Get('/couriers/meta-info/:id')
    async getCourierMetaInfo(
        @Param('id',ParseIntPipe)id,
        @Query('start_date')startDate:DateDto,
        @Query('end_date')endDate:DateDto){
        try{
            return await this.courierService.getCourierMetaInfo(id, String(startDate), String(endDate));
        }
        catch(err){
            return err;
        }
    }
}