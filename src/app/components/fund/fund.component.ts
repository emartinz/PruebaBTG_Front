
import { Component, OnInit } from '@angular/core';
import { FundService } from '../../services/fund.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ApiResponse } from '../../models/general/ApiResponse';
import { UserService } from '../../services/user.service';
import { User } from '../../models/entity/User';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [ReactiveFormsModule, NgxCurrencyDirective],
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.scss'],
  providers: [provideNgxMask()]
})
export class FundComponent implements OnInit {
  myForm: FormGroup;
  funds: any[] = [];
  selectedFund: any;
  investmentAmount: number | null = null;
  message: string = '';
  selectedUser: User | null = null;
  selectedUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private fundService: FundService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Definicion de FormGroup
    this.myForm = this.fb.group({
      userId: [{ value: '', disabled: true }, Validators.required], 
      selectedFund: ['672fb37f9d71eb398cb96ff4', Validators.required],
      investmentAmount: [null, [Validators.required, Validators.min(0)]]
    }); 
  }

  ngOnInit(): void {
    this.fundService.getFundsList().subscribe({
      next: (response: ApiResponse<any>) => {
        this.funds = response.data;
      },
      error: (error) => {
        console.error('Error fetching funds list:', error);
        this.message = 'Error fetching funds list.';
      }
    });

    this.userService.getSelectedUser().subscribe(user => {
      if (user !== null) {
        this.selectedUser = user;
        this.myForm.patchValue({ userId: user.id });
      } else {
        this.selectedUser = null;
      }
    });
  }

  // Procesos
  subscribe() {
    if (this.myForm.invalid) {
      console.log('Formulario:', this.myForm);
      console.log('Errores del formulario:', this.myForm.errors);
      console.log('Estado de cada control:', {
        selectedFund: this.myForm.get('selectedFund')?.errors,
        investmentAmount: this.myForm.get('investmentAmount')?.errors
      });

      this.message = 'Please complete all required fields correctly.';
      return;
    }

     // Obtener el userId directamente del selectedUser
    if (this.selectedUser) {
      const { selectedFund, investmentAmount } = this.myForm.value;
      this.fundService.subscribe(this.selectedUser.id, selectedFund, investmentAmount).subscribe({
        next: (response: any) => {
          this.message = response.message || 'Subscription successful.';
          // Recargar los detalles del usuario
          this.userService.reloadSelectedUser();
        },
        error: (error) => {
          console.log(error);
          if (error.error && typeof error.error === 'object') {
            const apiError: ApiResponse<any> = error.error;
            this.message = `Error: ${apiError.message || 'An error occurred.'}`;
          } else {
            this.message = `Error: ${error.message || 'An unexpected error occurred.'}`;
          }
        }
      });
    } else {
      this.message = 'No se ha seleccionado un usuario.';
    }
  }

  cancel() {
    if (this.selectedUser) {
      const { selectedFund } = this.myForm.value;
      this.fundService.cancel(this.selectedUser.id, selectedFund).subscribe({
        next: (response: any) => {
          this.message = response.message || 'Cancellation successful.';

          // Recargar los detalles del usuario
          this.userService.reloadSelectedUser();
        },
        error: (error) => {
          if (error.error && typeof error.error === 'object') {
            const apiError: ApiResponse<any> = error.error;
            this.message = `Error: ${apiError.message || 'An error occurred.'}`;
          } else {
            this.message = `Error: ${error.message || 'An unexpected error occurred.'}`;
          }
        }
      });
    } else {
      this.message = 'No se ha seleccionado un usuario.';
    }
  }

  // Eventos
  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.myForm.patchValue({ selectedFund: selectedValue });
  }

}
