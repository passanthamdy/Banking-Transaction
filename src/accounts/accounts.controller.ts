import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { APIResponse } from 'src/common/api-models/api-response';
import { TransactionDto } from './dto/transaction.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('accounts')
export class AccountsController {

    constructor(private readonly accountService: AccountsService) {

    }
    
    @ApiOperation({ summary: 'Create a new account', description: 'Creates a new account with a unique account number' })
    @Post()
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        const account = await this.accountService.createAccount(createAccountDto);
        return new APIResponse({
            Status: 201,
            Data: account
        })
    }

    @ApiOperation({ summary: 'Get account balance', description: 'Retrieves the balance of the specified account' })
    @Get(':id/balance')
    async getBalance(@Param('id', ParseIntPipe) id: number) {
        const accountBalance = await this.accountService.getBalance(id);
        return new APIResponse({
            Status: 200,
            Data: accountBalance
        })
    }
    @ApiOperation({ summary: 'Deposit funds', description: 'Deposits a specific amount into the account' })
    @Post(':id/transactions/deposit')
    async deposit(@Param('id', ParseIntPipe) id: number, @Body() depositTransaction: TransactionDto) {
        const transactionId = await this.accountService.deposit(id, depositTransaction);
        return new APIResponse({
            Status: 200,
            Data: transactionId
        })
    }

    @ApiOperation({ summary: 'Withdraw funds', description: 'Withdraws a specific amount from the account' })
    @Post(':id/transactions/withdraw')
    async withdraw(@Param('id', ParseIntPipe) id: number, @Body() depositTransaction: TransactionDto) {
        const transactionId = await this.accountService.withdraw(id, depositTransaction);
        return new APIResponse({
            Status: 200,
            Data: transactionId
        })
    }
}
