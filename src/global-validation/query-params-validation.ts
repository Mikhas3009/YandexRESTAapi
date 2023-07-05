import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WrongQueryException } from 'src/exceptions/wrong-query-params';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(value == undefined){
            return value;
        } 
        if(value == ''){
            throw new WrongQueryException("Неккоректные параметры в запросе offset и limit должны быть целыми числами!!")
        }   
        if(isNaN(Number(value))){
            throw new WrongQueryException("Неккоректные параметры в запросе offset и limit должны быть целыми числами!!")
        }
        return value;
    }
}