import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),  forwardRef(() => AccountsModule),],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [ TransactionsService],

})
export class TransactionsModule { }
