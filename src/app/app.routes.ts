import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FundComponent } from './components/fund/fund.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'subscribe', component: FundComponent },
  { path: 'transaction-history', component: TransactionHistoryComponent }
];