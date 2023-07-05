import { Module, ValidationPipe } from '@nestjs/common';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';
import { CourierRepositoryModule } from 'src/repository/courier-repository/courier-repository.module';
import { APP_PIPE } from '@nestjs/core';
import { OrderRepositoryModule } from 'src/repository/order-repository/order-repository.module';


@Module({
    imports:[
        CourierRepositoryModule,
        OrderRepositoryModule
    ],  
    controllers: [CourierController],
    providers: [
        CourierService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ]
})
export class CourierModule {}