import {Table,Model,Column,DataType,ForeignKey,BelongsTo, HasMany} from 'sequelize-typescript';
import { CourierPriorModel } from '../courier-prior/courier-prior-model';
import { OrderModel } from '../order/order-model';
import { ApiProperty } from '@nestjs/swagger';


@Table({tableName:"courier",createdAt:false,updatedAt:false})
export class CourierModel extends Model<CourierModel>{

    @ApiProperty({example:1, description:"Уникальный индентификатор пользователя"})
    @Column({type:DataType.INTEGER,primaryKey:true,autoIncrement:true, unique:true})
    courierId:number;

    
    @ApiProperty({example:"Натурал Альбертович", description:"ФИО курьера"})
    @Column({type:DataType.STRING(70),allowNull:false})
    courierFio:string;

    
    @ApiProperty({example:1, description:"Тип курьера"})
    @ForeignKey(()=>CourierPriorModel)
    @Column({type:DataType.INTEGER})
    typeId:number;

    
    @ApiProperty({example:[1,2], description:"Районы в которых работает курьер"})
    @Column({type:DataType.ARRAY(DataType.INTEGER),allowNull:false})
    courierArea:number[];

    
    @ApiProperty({example:"9:00", description:"Время начало работы курьера"})
    @Column({type:DataType.TIME,allowNull:false})
    courierStartTime:string;

    
    @ApiProperty({example:"9:00", description:"Время окончания рабочего дня курьера"})
    @Column({type:DataType.TIME,allowNull:false})
    courierEndTime:string;

    @HasMany(()=>OrderModel)
    courierOrder:OrderModel[];

    @BelongsTo(()=>CourierPriorModel)
    courierPrior:CourierPriorModel
}