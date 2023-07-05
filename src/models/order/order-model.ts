import {  BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { CourierModel } from "../courier/courier-model";
import { ApiProperty } from "@nestjs/swagger";

@Table({tableName:"orders",createdAt:false,updatedAt:false})
export class OrderModel extends Model<OrderModel>{

    @ApiProperty({example:1, description:"Уникальный индентификатор заказа"})
    @Column({type:DataType.INTEGER,primaryKey:true,autoIncrement:true, unique:true})
    orderId:number;

    @ApiProperty({example:1, description:"Вес заказа"})
    @Column({type:DataType.INTEGER,allowNull:false})
    orderWeight:number;

    @ApiProperty({example:1, description:"район заказа"})
    @Column({type:DataType.INTEGER,allowNull:false})
    orderArea:number;

    @ApiProperty({example:"22:00-23:00", description:"Удобное время доставки"})
    @Column({type:DataType.STRING(12),allowNull:false})
    orderTime:string;

    @ApiProperty({example:1, description:"id курьера, осуществляющего заказ"})
    @ForeignKey(()=>CourierModel)
    @Column({type:DataType.INTEGER,allowNull:true})
    courierId:number;

    @ApiProperty({example:null, description:"статус заказа (1- заказ завершен)"})
    @Column({type:DataType.INTEGER,allowNull:true})
    orderStatus:number;

    @ApiProperty({example:2000, description:"стоимость заказа"})
    @Column({type:DataType.INTEGER,allowNull:false})
    orderCost:number;

    @ApiProperty({example:"1:10:50", description:"Время доставки"})
    @Column({type:DataType.TIME,allowNull:true})
    orderDoneTime:string;

    @ApiProperty({example:"2023-05-02", description:"дата доставки"})
    @Column({type:DataType.DATEONLY,allowNull:true})
    orderDoneDate:string;

    @BelongsTo(()=>CourierModel)
    courierOrder:CourierModel;
}