import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourierModel } from 'src/models/courier/courier-model';
import { CourierRepositoryService } from 'src/repository/courier-repository/courier-repository.service';
import { CreateCourierDto } from './courier.dto';
import { FindOptions } from 'sequelize';
import { OrderModel } from 'src/models/order/order-model';
import { Op } from 'sequelize';
import { OrderRepositoryService } from 'src/repository/order-repository/order-repository.service';
import { CourierPriorModel } from 'src/models/courier-prior/courier-prior-model';


@Injectable()
export class CourierService {

    constructor(
        private courierRepository: CourierRepositoryService,
        private orderRepository: OrderRepositoryService
    ){}

    async getAllCouriers(offset=0,limit=1):Promise<CourierModel[]>{
        return await this.courierRepository.getCouriers(offset,limit)
        .catch((err)=>{
            throw err;
        })
    }

    async getUserById(userId:number):Promise<CourierModel>{
        return await this.courierRepository.getCourierById(userId)
        .catch((err)=>{
            throw err;
        });
    }

    async getAssigmentOrders(){
        return await this.orderRepository.getCompletedOrders()
        .catch((err)=>{
            throw err;
        })
    }
    
    async createCourier(courier:CreateCourierDto){
        courier.courierStartTime = courier.workTime.split('-')[0];
        courier.courierEndTime = courier.workTime.split('-')[1];
        if(courier.typeId<courier.courierArea.length){
            throw new HttpException("Курьер такого типа не может взять столько районов",HttpStatus.BAD_REQUEST)
        }
        return await this.courierRepository.createCourier(courier)
        .catch((err)=>{
            throw err;
        })
    }

    async getCourierMetaInfo(courierId:number,startDate:string,endDate:string){
        const options:FindOptions<OrderModel>={
            where:{
                courierId:courierId,
                orderDoneDate:{
                    [Op.between]:[startDate,endDate]
                }
            },
            include:{
                model:CourierModel,
                include:[{
                    model:CourierPriorModel
                }]
            }
        }
        const orders = await this.orderRepository.getCompletedOrders(options);
        if (orders.length ==0){
            return {message:`Курьер ${courierId} за заданный период не завершил ни одного заказа`}
        }
        const sum = await this.countCourierSalary(orders);
        const courierType = orders[0]?.courierOrder?.courierPrior
        const rank = await this.countCourierRank(orders.length,startDate,endDate,courierType)

        return {
            "Заработок":sum,
            "Ранг курьера":rank
        }
       
    }

    async countCourierSalary(orders:OrderModel[]):Promise<number>{
        let sum =0;
        orders.forEach(({dataValues:{orderCost,courierOrder:{courierPrior:{typePrice}}}})=>{
            sum+=orderCost*typePrice
        })
        return sum
    }

    async countCourierRank(
        numberOfOrders:number,
        startDate:string,
        endDate:string,
        courierPrior:CourierPriorModel
    ):Promise<number>{
        const sek = (new Date(endDate).getTime()-new Date(startDate).getTime())
        const hours = 24 + sek/(60000*60);
        return (numberOfOrders/hours)*courierPrior?.typePrice
    }
}