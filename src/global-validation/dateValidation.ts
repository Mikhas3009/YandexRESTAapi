import { IsDate, IsDateString, IsOptional } from "class-validator";

export class DateDto{

    @IsOptional()
    @IsDateString()
    date: string;
}