import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WrongQueryException } from 'src/exceptions/wrong-query-params';

@Injectable()
export class OrderValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        value?.forEach((item)=>{
            if (!checkPropery(item)){
                throw new WrongQueryException("Неккоректные данные в списке заказов")
            }
        })
        return value;
    }
}

function checkPropery(item){
    if(item.hasOwnProperty('orderWeight')&&item.hasOwnProperty('orderArea')&&item.hasOwnProperty('orderTime')&&item.hasOwnProperty('orderCost')){
        return true
    }
    else return false
}