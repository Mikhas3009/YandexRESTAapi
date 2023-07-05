import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderModel } from 'src/models/order/order-model';
import { OrderRepositoryService } from 'src/repository/order-repository/order-repository.service';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { FindOptions } from 'sequelize';
import { CourierRepositoryService } from 'src/repository/courier-repository/courier-repository.service';

@Injectable()
export class OrderService {

    constructor(
        private orderRepository:OrderRepositoryService,
        private courierRepository:CourierRepositoryService
    ){}

    async getOrderById(orderId:number):Promise<OrderModel>{
        return await this.orderRepository.getorderById(orderId)
        .catch((err)=>{
            throw err;
        })
    }

    async getOrders(offset=0,limit=1):Promise<OrderModel[]>{
        return await this.orderRepository.getOrders(offset,limit)
        .catch((err)=>{
            throw err;
        })
    }

    async addOrders(orders){
        return await this.orderRepository.addOrders(orders)
        .catch((err)=>{
            throw err;
        })
    }

    async completeOrders(data:CompleteOrderDto){
        const order = await this.getOrderById(data.orderId)
        if (!order){
            throw new HttpException("Bad request",HttpStatus.BAD_REQUEST)
        }
        if(order.courierId!=data.courierId||order.courierId==undefined){
            throw new HttpException("Bad request",HttpStatus.BAD_REQUEST)
        }
        if(!data.orderDoneDate){
            data.orderDoneDate = new Date().toLocaleDateString();
        }
        await this.orderRepository.updateOrderStatus(order.orderId,data.orderDoneTime,data.orderDoneDate)
        .catch((err)=>{
            throw err;
        })
    }

    //Распределение заказов между курьерами
    async assignOrders(){
        const options:FindOptions<OrderModel>={
            where:{courierId:null}
        }
        const orders = await this.orderRepository.getUnlimitedOrders(options);
        const couriers = await this.courierRepository.getAllCouriers();
        couriers.sort((a,b)=>
            a.dataValues.courierPrior.typeId-b.dataValues.courierPrior.typeId
        )
        const courierOrderMap = new Map<number,number[]>();
        const assigmentsOrders = new Set<number>();
        orders.forEach(({dataValues:{orderCost,orderArea,orderWeight,orderTime,orderId}})=>{
            couriers.forEach(({dataValues:{courierId,courierStartTime,courierEndTime,courierArea,courierPrior:{maxNumberOfOrders,maxWeigth,deliveryTime}}})=>{
                if(
                    this.checkValidWeight(orderWeight,maxWeigth)&&
                    this.checkValidArea(orderArea,courierArea)&&
                    this.checkCorrectTime(courierStartTime,courierEndTime,orderTime,deliveryTime)
                )
                    {
                        if(!courierOrderMap.has(courierId)){
                            if(!assigmentsOrders.has(orderId)){
                                courierOrderMap.set(courierId,[orderId])
                                assigmentsOrders.add(orderId)
                            }
                        }
                        else if(courierOrderMap.get(courierId).length<=maxNumberOfOrders){
                            if(!assigmentsOrders.has(orderId)){
                                assigmentsOrders.add(courierId)
                                courierOrderMap.set(courierId,[...courierOrderMap.get(courierId),orderId])
                            }
                        }
                }
            })
        })
        let err;
        courierOrderMap.forEach((value,key)=>{
            value.forEach(async(item)=>{
                await this.orderRepository.attachCourier(item,key)
                .catch(err=>{
                    err= err;
                })
            })
          
        })
        if(err){
            throw err;
        }
    }
    
    //Проверка подходит ли курьер под удобное время заказа
    checkCorrectTime(startTime:string, endTime:string, orderTime:string,deliveryTime:number){
        const orderLowerTime = orderTime.split('-')[0];
        const orderUpperTime = orderTime.split('-')[1];
        const timeOrderLower = new Date(`2015-02-21T${orderLowerTime}`);
        const timeOrderUpper = new Date(`2015-02-21T${orderUpperTime}`);
        const timeCourierLower = new Date(`2015-02-21T${startTime}`);
        const timeCourierUpper = new Date(`2015-02-21T${endTime}`);
        if(Number(timeCourierLower) - Number(timeOrderUpper)+deliveryTime*60*1000>0){
            return false;
        }
        if(Number(timeCourierUpper) - Number(timeOrderLower)+deliveryTime*60*1000<0){
            return false
        }
        return true
    }

    //Проверка района курьера
    checkValidArea(orderArea:number,courierArea:number[]):boolean{
        return courierArea.includes(orderArea)
    }

    //Проверка веса заказа
    checkValidWeight(orderWeigth:number, maxCourierWeigth:number):boolean{
        return orderWeigth<maxCourierWeigth
    }
}