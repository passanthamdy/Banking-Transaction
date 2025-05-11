import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../enums';
import { ERROR_MESSAGES } from '../config/error.config';

@Injectable()
export class AccountsService {

    constructor(
        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
        private readonly transactionsService: TransactionsService 
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
        const account =  await this.getAccountById(id);
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
        const account = await this.getAccountById(id);
        const transaction = await this.transactionsService.createTransaction({
            account: account,
            type: TransactionType.DEPOSIT,
            amount: depositTransaction.amount,
        })
        account.balance += depositTransaction.amount;
        await this.accountRepo.save(account);
        return transaction.id;

    }
    /**
     * Withdraws an amount from the account.
     * @param id - The ID of the account.
     * @param depositTransaction - The transaction details.
     * @returns The transaction Id.
     */
    async withdraw(id: number, depositTransaction: TransactionDto): Promise<number> {
        const account = await this.getAccountById(id);
        if (account.balance < depositTransaction.amount) {
            throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
        }
        const transaction = await this.transactionsService.createTransaction({
            account: account,
            type: TransactionType.WITHDRAW,
            amount: depositTransaction.amount,
        })
        account.balance -= depositTransaction.amount;
        await this.accountRepo.save(account);
        return transaction.id;
    }

}
