import {  IsNumber, Min } from 'class-validator';

export class TransactionDto {

   

    @IsNumber()
    @Min(0.01)
    amount: number;
}
