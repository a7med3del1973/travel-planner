import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/store/auth.store';


const passwordMatchValidator: ValidatorFn = (
  ctrl: AbstractControl
): ValidationErrors | null => {
  const pass = ctrl.get('password')?.value;
  const confirm = ctrl.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMsg  = signal('');
  showPass  = signal(false);

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  get usernameCtrl()        { return this.form.controls.username; }
  get emailCtrl()           { return this.form.controls.email; }
  get passwordCtrl()        { return this.form.controls.password; }
  get confirmPasswordCtrl() { return this.form.controls.confirmPassword; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set('');

    const { username, email, password } = this.form.getRawValue();
    this.authService.register({ username, email, password }).subscribe({
      next: () => {
        const role = this.authStore.user()?.role;
        this.router.navigate([role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard']);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Registration failed. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
