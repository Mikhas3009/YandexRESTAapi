import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourierModel } from './models/courier/courier-model';
import { CourierPriorModel } from './models/courier-prior/courier-prior-model';
import { OrderModel } from './models/order/order-model';

@Module({
    imports:[
        ConfigModule.forRoot({}),
        SequelizeModule.forRoot({
            dialect:"postgres",
            host: process.env.DB_HOST,
            database:"yandextask1"||process.env.DB_NAME,
            username:"postgres"||process.env.DB_USER,
            password:process.env.DB_PASS,
            port:Number(process.env.DB_PORT),
            synchronize: true,
            autoLoadModels: true,
            models:[
                CourierModel,
                CourierPriorModel,
                OrderModel,
            ]
        })
    ]
})
export class DBModule {}