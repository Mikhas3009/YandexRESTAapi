import { Type } from "class-transformer";
import { IsInt, Length, IsString, ValidateNested, ArrayMinSize, ArrayNotEmpty } from "class-validator";

export class OrderDto {


    @IsInt()
    orderWeight: number

    @IsInt()
    orderCost: number

    @IsInt()
    orderArea:number

    @IsString()
    @Length(10,12)
    orderTime:string

    courierId?:number

}

export class CreateOrdersDto {
    
    @ValidateNested({each:true})
    @Type(() => OrderDto)
    orders:OrderDto[];
}