import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { TransactionDto } from './dto/transaction.dto';
import { ERROR_MESSAGES } from '../config/error.config';
import { WithdrawTransaction } from '../common/database-transaction/withdraw-transaction';
import { DepositTransaction } from '../common/database-transaction/deposit-transaction';

@Injectable()
export class AccountsService {

    constructor(
        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
        private readonly withdrawTransaction: WithdrawTransaction,
        private readonly depositTransaction: DepositTransaction,


    ) { }
    /**
     * Creates a new account with a unique account number.
     * @param createAccount - The account details.
     * @returns The created account object.
     */
    async createAccount(createAccount: CreateAccountDto): Promise<Account> {
        const accountNumber = "ACC-" + Math.floor(Math.random() * 1000000);
        const account = this.accountRepo.create({
            accountNumber,
            accountName: createAccount.name,
        });
        return this.accountRepo.save(account);

    }
    /**
     * Retrieves the balance of an account by its ID.
     * @param id - The ID of the account.
     * @returns The balance of the account.
     * @throws NotFoundException if the account is not found.
     */
    async getBalance(id: number): Promise<number> {
        const account = await this.getAccountById(id);
        return account.balance;
    }

    /**
     * Retrieves an account by its ID.
     * @param id - The ID of the account.
     * @returns The account object.
     * @throws NotFoundException if the account is not found.
     */
    async getAccountById(id: number): Promise<Account> {
        const account = await this.accountRepo.findOne({ where: { id } });
        if (!account) {
            throw new NotFoundException(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
        }
        return account;
    }

    /**
     * Deposits an amount into the account.
     * @param id - The ID of the account.
     * @param depositTransaction - The transaction details.
     * @returns The transaction Id.
     */
    async deposit(id: number, depositTransaction: TransactionDto): Promise<number> {
      return this.depositTransaction.run({
        accountId: id,
        amount: depositTransaction.amount
      })

    }
    /**
     * Withdraws an amount from the account.
     * @param id - The ID of the account.
     * @param depositTransaction - The transaction details.
     * @returns The transaction Id.
     */
    async withdraw(id: number, withdrawDto: TransactionDto): Promise<number> {
        return this.withdrawTransaction.run({
            accountId: id,
            amount: withdrawDto.amount
          });
    }



}
