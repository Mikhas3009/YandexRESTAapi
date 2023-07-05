import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DBModule } from "src/DBmodule";
import { OrderModel } from "src/models/order/order-model";
import { OrderRepositoryService } from "./order-repository.service";

@Module({
    imports:[
        DBModule,
        SequelizeModule.forFeature([
            OrderModel
        ])
    ],
    providers:[OrderRepositoryService],
    exports:[OrderRepositoryService]
})
export class OrderRepositoryModule {}