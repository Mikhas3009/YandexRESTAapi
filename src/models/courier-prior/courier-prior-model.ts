import {Table,Model,Column,DataType, HasMany} from 'sequelize-typescript';
import { courierTypes } from './courliers-types';
import { CourierModel } from '../courier/courier-model';

@Table({tableName:"courier_type",createdAt:false,updatedAt:false})
export class CourierPriorModel extends Model<CourierPriorModel>{

    @Column({type:DataType.INTEGER,primaryKey:true,autoIncrement:true, unique:true})
    typeId:number;

    @Column({type:DataType.ENUM(...courierTypes),unique:true,allowNull:false})
    typeName:string;

    @Column({type:DataType.INTEGER,allowNull:false})
    typePrice:number;

    @Column({type:DataType.INTEGER,allowNull:false})
    maxWeigth:number;

    @Column({type:DataType.INTEGER,allowNull:false})
    maxNumberOfOrders:number;

    @Column({type:DataType.INTEGER,allowNull:false})
    deliveryTime:number;

    @Column({type:DataType.INTEGER,allowNull:false})
    deliveryTimeOthers:number;

    @HasMany(()=>CourierModel)
    courierPrior:CourierModel[];
}