import { Module } from '@nestjs/common';
import { CourierRepositoryService } from './courier-repository.service';
import { DBModule } from 'src/DBmodule';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourierModel } from 'src/models/courier/courier-model';

@Module({
    imports:[
        DBModule,
        SequelizeModule.forFeature([
            CourierModel
        ])
    ],
    providers: [CourierRepositoryService],
    exports:[CourierRepositoryService]
})
export class CourierRepositoryModule {}
