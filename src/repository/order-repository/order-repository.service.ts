import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FindOptions, Op, where } from "sequelize";
import { OrderModel } from "src/models/order/order-model";

@Injectable()
export class OrderRepositoryService{
    
    constructor(
        @InjectModel(OrderModel)private orderDB:typeof OrderModel
    ){}

    async getorderById(orderId:number): Promise<OrderModel>{
        return await this.orderDB.findOne({
            where:{orderId}
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Не удалось получить информацию о заказе",HttpStatus.BAD_GATEWAY)
        })
    }

    async getOrders(offset:number=0,limit:number): Promise<OrderModel[]>{
        return await this.orderDB.findAll({
            where:{
                orderId:{
                    [Op.gte]:offset
                },
                courierId:null
            },
            limit:limit
        })
        .catch((err)=>{
            console.log(err);
            throw new HttpException("Не удалось получить список заказов",HttpStatus.BAD_GATEWAY)
        })
    }

    async getUnlimitedOrders(options?:FindOptions<OrderModel>):Promise<OrderModel[]>{
        return await this.orderDB.findAll(options)
        .catch((err)=>{
            console.log(err);
            throw new HttpException("Не удалось получить список заказов",HttpStatus.BAD_GATEWAY)
        });
    }

    async getCompletedOrders(options:FindOptions<OrderModel>={where:{orderStatus:1}}){
        return await this.orderDB.findAll(options)
        .catch((err)=>{
            console.log(err);
            throw new HttpException("Не удалось получить список заказов",HttpStatus.BAD_GATEWAY)
        });
    }

    async addOrders(body): Promise<OrderModel[]>{
        return await this.orderDB.bulkCreate(body)
        .catch((err)=>{
            console.log(err);
            throw new HttpException("Не удалось добавить заказы ",HttpStatus.BAD_GATEWAY)
        })
    }

    async updateOrderStatus(idOrder:number,time:string,date:string){
        await this.orderDB.update(
            {
                orderStatus:1,
                orderDoneTime:time,
                orderDoneDate:date
            },
            {
                where:{orderId:idOrder}
            })
            .catch((err)=>{
                console.log(err);
                throw new HttpException("Не удалось завершить заказ",HttpStatus.BAD_GATEWAY)
            })
    }

    async attachCourier(idOrder:number,idCourier:number){
        console.log(idOrder,idCourier)
        await this.orderDB.update(
            {
                courierId:idCourier,
            },
            {
                where:{orderId:idOrder}
            }
        )
        .catch((err)=>{
            console.log(err)
            throw new HttpException("Не удалось прикрепить курьера",HttpStatus.BAD_GATEWAY)
        })
    }
}