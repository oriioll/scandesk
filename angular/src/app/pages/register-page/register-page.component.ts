import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRequest } from '../../models/user/user.request';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPage {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  private fb = inject(NonNullableFormBuilder);
  public loading = signal(false);
  public error = signal(false);
  public errorMsg = signal('');
  public form = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[^\p{L}\p{N}\s])\S{8,50}$/u)],
    ],
  });

  /**
   * Handles creation of users
   */
  public onRegister(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    if (this.form.invalid) {
      this.loading.set(false);
      this.form.markAllAsTouched();
      return;
    }
    //Reset error states
    this.error.set(false);
    this.errorMsg.set('');
    const user: UserRequest = this.form.getRawValue();
    this.authService
      .createUser(user)
      .pipe(finalize(() => this.loading.set(false))) //Loading state
      .subscribe({
        next: () => {
          //Go to the dashboard once login is completed
          this.router.navigate(['/dashboard']);
          console.log('LOGIN COMPLETE');
        },
        error: (err) => {
          this.error.set(true);
          this.errorMsg.set("Couldn't create your account, try again later");
        },
      });
  }

  /**
   * Getters for form inputs
   */
  get name() {
    return this.form.controls.name;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }
}
