import { Component, inject, signal } from '@angular/core';
import { UserRequest } from '../../models/user/user.request';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPage {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  private fb = inject(NonNullableFormBuilder);
  public loading = signal(false);
  public error = signal(false);
  public errorMsg = signal('');
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  /**
   * Handles log in of the usre
   */
  public onLogin(event: Event) {
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
    const user: UserRequest = { name: 'John doe', ...this.form.getRawValue() };
    this.authService
      .loginUser(user)
      .pipe(finalize(() => this.loading.set(false))) //Loading state
      .subscribe({
        next: () => {
          //Go to the dashboard once login is completed
          this.router.navigate(['/dashboard']);
          console.log('LOGIN COMPLETE');
        },
        error: (err: any) => {
          this.error.set(true);
          //Handle message based on the http error code response of the server
          this.errorMsg.set(
            err.status === 401 || err.status === 422
              ? 'Incorrect email or password'
              : err.status === 429
                ? 'Too many attempts, try again in a minute'
                : err.status === 0
                  ? "Can't reach the server"
                  : 'Something went wrong, try again',
          );
        },
      });
  }

  /**
   * Getters for form inputs
   */

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }
}
