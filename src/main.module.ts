import { Module } from '@nestjs/common';
import { CourierModule } from './courier/courier.module';
import { OrderModule } from './order/order.module';

@Module({
    imports: [
        CourierModule,
        OrderModule,
    ]
})
export class MainModule {}