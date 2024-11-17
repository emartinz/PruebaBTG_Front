import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/entity/User';
import { CommonModule } from '@angular/common';
import { ApiResponse } from './models/general/ApiResponse';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'investment-app';
  users: any[] = [];
  selectedUser: User | null = null;
  userBalance: number | null = null;
  selectedUser$: Observable<User | null>;

  constructor(private userService: UserService) {
    this.selectedUser$ = this.userService.selectedUser$;
  }

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe({
      next: (response: ApiResponse<any>) => {
        this.users = response.data;
        
        // Asignar el primer usuario como seleccionado después de cargar los datos
        if (this.users.length > 0) {
          this.selectedUser = this.users[0];
          this.userService.setSelectedUser(this.selectedUser);
        }
      },
      error: (error) => {
        console.error('Error fetching funds list:', error);
      }
    });

    // Escuchar cambios en el usuario seleccionado
    this.userService.selectedUser$.subscribe((user) => {
      this.selectedUser = user;
    });
  }

  onUserChange(event: Event): void {
    const userId = (event.target as HTMLSelectElement).value;
    this.userService.getUserById(userId).subscribe(response => {
      const user = response.data; // Asignar directamente `response.data`
  
      // Asegúrate de que el valor asignado no sea `undefined`
      this.selectedUser = user || null;  // Asignar null si `user` es `undefined`
  
      // Llamar al método setSelectedUser con el usuario obtenido
      if (user !== undefined) {
        this.setSelectedUser(user);
      }
    });
  }

  setSelectedUser(user: User): void {
    this.userService.setSelectedUser(user);
  }

  getInitials(name: string): string {
    return name
      .split(' ').map((word) => word[0])
      .join('').toUpperCase();
  }
}