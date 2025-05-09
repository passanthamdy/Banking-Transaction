import { Transaction } from 'src/transactions/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('accounts')
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    accountNumber: string;

    @Column()
    accountName: string;

    @Column({
        type: 'decimal', precision: 12, scale: 2, default: 0, transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    balance: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Transaction, transaction => transaction.account)
    transactions: Transaction[];
}
