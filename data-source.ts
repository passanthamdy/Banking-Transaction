import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Account } from './src/accounts/account.entity';
import { Transaction } from './src/transactions/transaction.entity';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Account, Transaction],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
