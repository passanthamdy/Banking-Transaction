import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { WithdrawTransaction } from '../common/database-transaction/withdraw-transaction';
import { DepositTransaction } from '../common/database-transaction/deposit-transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), forwardRef(() => TransactionsModule), ],
  providers: [AccountsService, WithdrawTransaction, DepositTransaction],
  controllers: [AccountsController],
})
export class AccountsModule { }
