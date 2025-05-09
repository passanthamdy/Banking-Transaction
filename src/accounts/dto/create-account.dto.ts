import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {

  @ApiProperty({
    description: 'The name of the account holder',
    example: 'Passant Hamdy',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
