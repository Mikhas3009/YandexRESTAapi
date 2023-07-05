import {IsNotEmpty,IsInt,IsArray, IsString, IsNumberString, ArrayNotEmpty, ArrayMinSize } from 'class-validator'


export class CreateCourierDto {

    @IsString({message:"Поле должно быть строкой!"})
    @IsNotEmpty({message:"Поле fio не может быть пустым"})
    courierFio:string;

    @IsString({message:"Поле должно быть строкой!"})
    @IsNotEmpty({message:"Поле workTime не может быть пустым"})
    workTime:string;
    
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    courierArea:number[];

    @IsNumberString({},{message:"typeId должно быть числом"})
    @IsNotEmpty({message:"Поле typeId не может быть пустым"})
    typeId:number; 

    courierStartTime?:string;
    
    courierEndTime?:string;

}