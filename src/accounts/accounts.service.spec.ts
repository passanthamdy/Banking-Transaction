import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../config/error.config';
import { TransactionType } from '../enums';

describe('AccountsService', () => {
  let accountService: AccountsService;
  let accountRepo: Repository<Account>;
  let transactionsService: TransactionsService;

  const testAccount: Account = {
    id: 1,
    accountName: 'Test Account',
    accountNumber: 'ACC-123456',
    balance: 1000,
    transactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const createAccountDto: CreateAccountDto = {
    name: 'Test Account',
  }

  const transactionResult = { id: 10 };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            create: jest.fn().mockReturnValue(testAccount),
            save: jest.fn().mockResolvedValue(testAccount),
            findOne: jest.fn().mockResolvedValue(testAccount),
          }
        },
        {
          provide: TransactionsService,
          useValue: {
            createTransaction: jest.fn().mockResolvedValue(transactionResult),
          },
        },

      ],

    }).compile();

    accountService = module.get<AccountsService>(AccountsService);
    accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
    transactionsService = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();

  });
  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create and save a new account', async () => {

      const result = await accountService.createAccount(createAccountDto);

      expect(accountRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountName: 'Test Account',
          accountNumber: expect.stringMatching(/^ACC-\d{1,6}$/),
        }),
      );
      expect(accountRepo.save).toHaveBeenCalledWith(testAccount);
      expect(result).toEqual(testAccount);
    });
  });

  describe('getBalance', () => {
    it('should return account balance', async () => {
      const result = await accountService.getBalance(1);
      expect(result).toBe(1000);
    });

    it('should throw NotFoundException if account is not found', async () => {
      jest.spyOn(accountRepo, 'findOne').mockResolvedValue(null);
      await expect(accountService.getBalance(999)).rejects.toThrow(NotFoundException);
      await expect(accountService.getBalance(999)).rejects.toThrow(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    });
  });

  describe('getAccountById', () => {
    it('should return account by id', async () => {
      jest.spyOn(accountRepo, 'findOne').mockResolvedValue(testAccount);
      const result = await accountService.getAccountById(1);
      expect(result).toEqual(testAccount);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(accountRepo, 'findOne').mockResolvedValue(null);
      await expect(accountService.getAccountById(999)).rejects.toThrow(NotFoundException);
      await expect(accountService.getAccountById(999)).rejects.toThrow(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    });
  });

  describe('deposit', () => {
    it('should deposit amount and return transaction id', async () => {
      const depositTransaction = { amount: 500 };
      const accountCopy = JSON.parse(JSON.stringify(testAccount));
      jest.spyOn(accountService, 'getAccountById').mockResolvedValue(accountCopy);

      const result = await accountService.deposit(1, depositTransaction);
      console.log("result", result);

      expect(transactionsService.createTransaction).toHaveBeenCalledWith({
        account: accountCopy,
        type: TransactionType.DEPOSIT,
        amount: 500,
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...accountCopy,
        balance: 1500,
      });
      expect(result).toBe(transactionResult.id);
    });
  });

  describe('withdraw', () => {
    it('should withdraw amount and return transaction id', async () => {
      const withdrawTransaction = { amount: 300 };
      const accountCopy = JSON.parse(JSON.stringify(testAccount)); // balance = 1000

      jest.spyOn(accountService, 'getAccountById').mockResolvedValue(accountCopy);
      const result = await accountService.withdraw(1, withdrawTransaction);
      expect(transactionsService.createTransaction).toHaveBeenCalledWith({
        account: accountCopy,
        type: TransactionType.WITHDRAW,
        amount: 300,
      });

      expect(accountRepo.save).toHaveBeenCalledWith({
        ...accountCopy,
        balance: 700,
      });
      expect(result).toBe(transactionResult.id);
    });

    it('should throw BadRequestException if balance is insufficient', async () => {
      const withdrawTransaction = { amount: 2000 };
      const accountCopy = JSON.parse(JSON.stringify(testAccount));
      accountCopy.balance = 100;

      jest.spyOn(accountService, 'getAccountById').mockResolvedValue(accountCopy);

      await expect(accountService.withdraw(1, withdrawTransaction)).rejects.toThrow(BadRequestException);
      await expect(accountService.withdraw(1, withdrawTransaction)).rejects.toThrow(ERROR_MESSAGES.INSUFFICIENT_BALANCE);

      expect(transactionsService.createTransaction).not.toHaveBeenCalled();
      expect(accountRepo.save).not.toHaveBeenCalled();
    });
  });

});


