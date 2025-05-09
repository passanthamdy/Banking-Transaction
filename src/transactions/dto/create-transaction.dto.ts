import { Account } from 'src/accounts/account.entity';
import { TransactionType } from 'src/enums';

export class CreateTransactionDto {
  type: TransactionType;

  amount: number;

  account: Account


}
