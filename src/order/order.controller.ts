import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { QueryValidationPipe } from 'src/global-validation/query-params-validation';
import { CreateOrdersDto } from './dto/order.dto';
import { OrderValidationPipe } from 'src/global-validation/order-validation';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrderModel } from 'src/models/order/order-model';

@Throttle(10, 1)
@Controller('')
export class OrderController {
    
    constructor(
        private orderService:OrderService
    ){}

    @ApiOperation({summary:"Получение заказа по Id"})
    @ApiParam({name:"order_id",description:"id заказа"})
    @ApiResponse({status:201, type: OrderModel})
    @Get('/orders/:order_id')
    async getOrderById(@Param('order_id',ParseIntPipe)orderId){
        try{
            return await this.orderService.getOrderById(orderId)
        }
        catch(err){
            return err;
        }
    }

    @ApiOperation({summary:"Получение заказов"})
    @ApiQuery({ name: 'offset', description: 'Id заказа с которого нужно сделать выгрузку' })
    @ApiQuery({ name: 'limit', description: 'Лимит заказов которых вы хотите вывести' })
    @ApiResponse({status:201, type: [OrderModel]})
    @Get('/orders')
    async getOrders(@Query('offset',QueryValidationPipe)offset,@Query('limit',QueryValidationPipe)limit){
        try{
            return await this.orderService.getOrders(offset,limit)
        }
        catch(err){
            return err;
        }
    }

    @ApiOperation({summary:"Добавление заказа"})
    @ApiResponse({status:201, type: OrderModel})
    @Post('/orders')
    async addOrders(@Body(OrderValidationPipe) orders:CreateOrdersDto){
        try{
            return await this.orderService.addOrders(orders)
        }
        catch(err){
            return err;
        }
    }

    @ApiOperation({summary:"Завершение заказа"})
    @Post('/orders/complete')
    async completeOrders(@Body() completedOrders:CompleteOrderDto){
        try{
            await this.orderService.completeOrders(completedOrders)
            return HttpStatus.OK
        }
        catch(err){
            return err;
        }
    }

    @ApiOperation({summary:"Распределение заказов по курьерам"})
    @Post('/orders/assign')
    async assignOrders(){
        try{
            await this.orderService.assignOrders();
            return 200
        }
        catch(err){
            return err;
        }
    }
}
