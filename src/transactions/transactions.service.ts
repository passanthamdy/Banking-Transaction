import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
    ) { }

    async createTransaction( createTransaction: CreateTransactionDto): Promise<Transaction> {
        const transaction = this.transactionRepo.create(createTransaction);
        return this.transactionRepo.save(transaction);
    }

}
