import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {

    @ApiProperty({
        description: 'The amount to be deposited or withdrawn',
        example: 100.00
    })
    @IsNumber()
    @Min(0.01)
    amount: number;
}
