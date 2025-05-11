import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BaseTransaction } from './base-transaction';
import { DataSource, EntityManager } from 'typeorm';
import { Account } from '../../accounts/account.entity';
import { Transaction } from '../../transactions/transaction.entity';
import { TransactionType } from '../../enums';
import { ERROR_MESSAGES } from '../../config/error.config';


interface WithdrawData {
  accountId: number;
  amount: number;
}

@Injectable()
export class WithdrawTransaction extends BaseTransaction<WithdrawData, number> {
  constructor(protected override readonly dataSource: DataSource) {
    super(dataSource);
  }

  protected async execute(
    data: WithdrawData,
    manager: EntityManager
  ): Promise<number> {

    const account = await manager.findOne(Account, {
      where: { id: data.accountId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!account) {
        throw new NotFoundException(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }
    if (account.balance < data.amount) {
      throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
    }

    account.balance -= data.amount;
    await manager.save(account);

    const transaction = manager.create(Transaction, {
      account,
      amount: data.amount,
      type: TransactionType.WITHDRAW,
    });
    const savedTransaction = await manager.save(transaction);

    return savedTransaction.id;
  }
}
