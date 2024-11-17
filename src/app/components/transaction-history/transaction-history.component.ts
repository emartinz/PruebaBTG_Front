import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent {
  userId: string = '';
  transactions: any[] = [];

  constructor(private transactionService: TransactionService) {}

  getTransactionHistory() {
    this.transactionService.getTransactionHistory(this.userId)
      .subscribe(response => {
        this.transactions = response;
      });
  }

  getTransactionsByType(type: string) {
    this.transactionService.getTransactionsByType(this.userId, type)
      .subscribe(response => {
        this.transactions = response;
      });
  }
}
