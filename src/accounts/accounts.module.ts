import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account]),
    AccountsModule 
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule { }
