import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/general/ApiResponse';

@Injectable({ providedIn: 'root' })
export class FundService {
  private baseUrl = 'http://localhost:8080/api/funds'; // Reemplaza con la URL de tu API
  
  constructor(private http: HttpClient) { }

  // Método para suscribirse a un fondo
  subscribe(userId: string, fundId: string, investmentAmount: number) {
    return this.http.post(`${this.baseUrl}/subscribe`, {
      userId,
      fundId,
      investmentAmount
    });
  }

  // Método para cancelar la suscripción a un fondo
  cancel(userId: string, fundId: string) {
    return this.http.post(`${this.baseUrl}/cancel`, {
      userId,
      fundId
    });
  }

  getFundsList(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/getList`); 
  }
}
