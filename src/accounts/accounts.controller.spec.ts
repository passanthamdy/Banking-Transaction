import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { APIResponse } from '../common/api-models/api-response';
import { TransactionDto } from './dto/transaction.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;
  
  const mockAccount = { id: 1, accountName: 'Test Account', accountNumber: 'ACC-123456', balance: 1000 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            createAccount: jest.fn().mockReturnValue(mockAccount),
            getBalance: jest.fn().mockResolvedValue(1000),
            deposit: jest.fn().mockResolvedValue(99),
            withdraw: jest.fn().mockResolvedValue(55),
          },
        }
      ]
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);

    jest.clearAllMocks();

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAccount', () => {
    it('should return created account in APIResponse', async () => {
      const dto: CreateAccountDto = { name: 'Test Account' };
      const result = await controller.createAccount(dto);
      expect(service.createAccount).toHaveBeenCalledWith(dto);
      expect(result).toEqual(new APIResponse({ Status: 201, Data: mockAccount }));


    });
  });

  describe('getBalance', () => {
    it('should return balance in APIResponse', async () => {
      const result = await controller.getBalance(1);
      console.log("resss", result)
      expect(service.getBalance).toHaveBeenCalledWith(1);
      expect(result).toEqual(new APIResponse({ Status: 200, Data: 1000 }));
    });
  });

  describe('deposit', () => {
    it('should deposit amount and return transaction id in APIResponse', async () => {
      const transactionDto: TransactionDto = { amount: 200 };

      const result = await controller.deposit(1, transactionDto);
      expect(service.deposit).toHaveBeenCalledWith(1, transactionDto);
      expect(result).toEqual(new APIResponse({ Status: 200, Data: 99 }));
    });
  });

  describe('withdraw', () => {
    it('should withdraw amount and return transaction id in APIResponse', async () => {
      const transactionDto: TransactionDto = { amount: 100 };
      const result = await controller.withdraw(1, transactionDto);
      expect(service.withdraw).toHaveBeenCalledWith(1, transactionDto);
      expect(result).toEqual(new APIResponse({ Status: 200, Data: 55 }));
      
    });
  });
});
