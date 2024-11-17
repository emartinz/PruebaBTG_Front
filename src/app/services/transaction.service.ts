import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactionHistory(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${userId}`);
  }

  getTransactionsByType(userId: string, type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${userId}/${type}`);
  }  
}