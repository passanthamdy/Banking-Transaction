import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Account } from '../accounts/account.entity';
import { Repository } from 'typeorm';
import { TransactionType } from '../enums';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepo: Repository<Transaction>;

  const testAccount = { id: 1, accountName: 'Test', balance: 1000 } as Account;
  const createTransactionDto: CreateTransactionDto = {
    type: TransactionType.DEPOSIT,
    amount: 500,
    account: testAccount,
  };
  const testTransaction = {
    id: 100,
    ...createTransactionDto,
  } as Transaction;



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn().mockResolvedValue(testTransaction),
            create: jest.fn().mockReturnValue(testTransaction),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction', async () => {
    const result = await service.createTransaction(createTransactionDto);
    expect(result).toEqual(testTransaction);
    expect(transactionRepo.create).toHaveBeenCalledWith(createTransactionDto);
    expect(transactionRepo.save).toHaveBeenCalledWith(testTransaction);
  });


});
