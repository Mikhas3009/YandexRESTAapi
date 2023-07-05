import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateCourierDto } from 'src/courier/courier.dto';
import { CourierPriorModel } from 'src/models/courier-prior/courier-prior-model';
import { CourierModel } from 'src/models/courier/courier-model';

@Injectable()
export class CourierRepositoryService {

    constructor(
        @InjectModel(CourierModel)private courierDb:typeof CourierModel
    ){}

    async getCouriers(offset,limit): Promise<CourierModel[]> {
        return await this.courierDb.findAll({
            where:{
                courierId:{
                    [Op.between]:[offset,offset + limit]
                }
            },
            limit:limit
        })
        .catch((err)=>{
            console.log(err);
            throw new HttpException("Не удалось получить список курьеров",HttpStatus.BAD_GATEWAY)
        })
    }
    
    async getCourierById(id:number): Promise<CourierModel>{
        return await this.courierDb.findOne({
            where:{courierId:id}
        })
        .catch((err)=>{
            console.log(err)
            throw new HttpException("Не удалось получить курьера",HttpStatus.BAD_GATEWAY)
        })
    }

    async createCourier(courier:CreateCourierDto): Promise<CourierModel>{
        return await this.courierDb.create(courier)
        .catch((err)=>{
            console.log(err);
            throw new HttpException('Не удалось добавить курьера',HttpStatus.BAD_GATEWAY)
        });
    }

    async getAllCouriers(): Promise<CourierModel[]>{
        return await this.courierDb.findAll({
            include:{
                model:CourierPriorModel
            }
        })
        .catch((err)=>{
            console.log(err);
            throw new HttpException("Не удалось получить список курьеров",HttpStatus.BAD_GATEWAY)
        })
    }
}
