import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { APIResponse } from 'src/common/api-models/api-response';
import { TransactionDto } from './dto/transaction.dto';

@Controller('accounts')
export class AccountsController {

    constructor(private readonly accountService: AccountsService) {

    }

    @Post()
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        const account = await this.accountService.createAccount(createAccountDto);
        return new APIResponse({
            Status: 201,
            Data: account
        })
    }

    @Get(':id/balance')
    async getBalance(@Param('id', ParseIntPipe) id: number) {
        const accountBalance = await this.accountService.getBalance(id);
        return new APIResponse({
            Status: 200,
            Data: accountBalance
        })
    }

    @Post(':id/transactions/deposit')
    async deposit(@Param('id', ParseIntPipe) id: number, @Body() depositTransaction: TransactionDto) {
        const transactionId = await this.accountService.deposit(id, depositTransaction);
        return new APIResponse({
            Status: 200,
            Data: transactionId
        })
    }

    @Post(':id/transactions/withdraw')
    async withdraw(@Param('id', ParseIntPipe) id: number, @Body() depositTransaction: TransactionDto) {
        const transactionId = await this.accountService.withdraw(id, depositTransaction);
        return new APIResponse({
            Status: 200,
            Data: transactionId
        })
    }
}
