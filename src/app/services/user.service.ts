import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/entity/User';
import { ApiResponse } from '../models/general/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private selectedUserSubject = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  setSelectedUser(user: User | null): void {
    // Solo actualizamos si el usuario no es null
    if (user !== null) {
      this.selectedUserSubject.next(user);
    }
  }

  getSelectedUser(): Observable<User | null> {
    return this.selectedUser$;
  }

  fetchUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getAll`);
  } 

  // Método para obtener el balance de un usuario
  getBalance(userId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/getBalance/${userId}`);
  }

  getUserById(userId: string) {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/get/${userId}`);
  }

  reloadSelectedUser(){
    const user = this.selectedUserSubject.getValue() as User;

    this.getUserById(user.id).subscribe(response => {
      const user = response.data;

      // Llamar al método setSelectedUser con el usuario obtenido
      if (user !== undefined) {
        this.setSelectedUser(user);
      }
    });
  }

  
}