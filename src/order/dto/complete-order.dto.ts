import { IsInt, IsLocale, IsString, Min} from "class-validator";

export class CompleteOrderDto {

    @IsInt({message:"Id курьера должно быть целым положительным числом"})
    @Min(1)
    courierId:number;

    @Min(1)
    @IsInt({message:"Id заказа должно быть целым положительным числом"})
    orderId:number;

    @IsString({message:"Время заказа должно быть в валидном временном формате: 21:00"})
    orderDoneTime:string;

    orderDoneDate?:string;
}