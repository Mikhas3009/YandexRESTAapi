import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepositoryModule } from 'src/repository/order-repository/order-repository.module';
import { CourierRepositoryModule } from 'src/repository/courier-repository/courier-repository.module';

@Module({
    imports:[
        OrderRepositoryModule,
        CourierRepositoryModule
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}
