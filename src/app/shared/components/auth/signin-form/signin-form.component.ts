import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import {
  AuthService
} from '../../../../core/services/auth.service';

import {
  TokenService
} from '../../../../core/models/token.service';

import {
  ToastrService
} from 'ngx-toastr';

@Component({
  selector: 'app-signin-form',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],

  templateUrl: './signin-form.component.html',

  styleUrls: ['./signin-form.component.css'],
})

export class SigninFormComponent implements OnInit {

  // = UI VARIABLES =

  showPassword = false;

  showLoginCard = false;

  isLoading = false;

  isChecked = false;

  errorMessage = '';

  // = FORM =

  loginForm!: FormGroup;

  // = SERVICES =

  private authService = inject(AuthService);

  private router = inject(Router);

  private fb = inject(FormBuilder);

  private tokenService = inject(TokenService);

  private toastr = inject(ToastrService);

  // = INIT =

  ngOnInit(): void {

    this.initializeForm();
  }

  // = FORM INIT =

  initializeForm(): void {

    this.loginForm = this.fb.group({

      userName: [
        'Admin',
        Validators.required
      ],

      password: [
        'Admin@123',
        Validators.required
      ],

      captchaCode: [
        'ABCD'
      ],

      sessionCaptcha: [
        'ABCD'
      ]
    });
  }

  // = LOGIN =

  login(): void {

    // ===== FORM VALIDATION =====

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      this.toastr.warning(
        'Please fill all required fields',
        'Validation'
      );

      return;
    }

    // ===== START LOADER =====

    this.isLoading = true;

    this.errorMessage = '';

    console.log(
      'Login Payload:',
      this.loginForm.value
    );

    // ===== LOGIN API =====

    this.authService
      .login(this.loginForm.value)

      .subscribe({

        // ===== SUCCESS =====

        next: (response: any) => {

          console.log(
            'FULL LOGIN RESPONSE:',
            response
          );

          // ===== LOGIN FAILED =====

          if (
            response?.success === false ||
            !response?.msg?.token
          ) {

            this.errorMessage =

              response?.errors?.[0] ||

              response?.msg ||

              'Invalid Username Or Password';

            // ===== ERROR TOAST =====

            this.toastr.error(
              this.errorMessage,
              'Login Failed',
              {
                timeOut: 3000,
                closeButton: true,
                progressBar: true,
              }
            );

            this.isLoading = false;

            return;
          }

          // ===== TOKENS =====

          const accessToken =
            response?.msg?.token;

          const refreshToken =
            response?.msg?.refreshToken;

          // ===== SAVE TOKENS =====

          this.tokenService.setTokens(
            accessToken,
            refreshToken
          );

          console.log(
            'Tokens Saved Successfully'
          );

          // ===== ROLE =====

          const role =
            response?.msg?.roleName
              ?.toLowerCase();

          console.log(
            'USER ROLE:',
            role
          );

          // ===== SAVE USER =====

          this.authService.setCurrentUser({

            id:
              response?.msg?.userID,

            userName:
              response?.msg?.userName,

            role:
              role
          });

          // ===== SUCCESS TOAST =====

          this.toastr.success(
            'Login Successful',
            'Welcome',
            {
              timeOut: 3000,
              closeButton: true,
              progressBar: true,
            }
          );

          // ===== STOP LOADER =====

          this.isLoading = false;

          // ===== ROLE BASED ROUTING =====

          if (
            role === 'admin'
          ) {

            console.log(
              'Redirecting To Admin Dashboard'
            );

            this.router.navigate([
              '/admin'
            ]);
          }

          else if (

            role === 'sub admin' || role === 'subadmin' || role === 'sub-admin') {

            console.log(
              'Redirecting To Sub Admin Dashboard'
            );

            this.router.navigate([
              '/sub-admin'
            ]);
          }

          else {

            console.log(
              'Unknown Role'
            );

            this.toastr.error(
              'Role Not Authorized',
              'Access Denied'
            );

            this.router.navigate([
              '/signin'
            ]);
          }
        },

        // ===== HTTP ERROR =====

        error: (error) => {

          console.log(
            'LOGIN ERROR:',
            error
          );

          this.isLoading = false;

          this.errorMessage =

            error?.error?.errors?.[0] ||

            error?.error?.msg ||

            error?.error?.message ||

            'Login Failed';

          // ===== ERROR TOAST =====

          this.toastr.error(
            this.errorMessage,
            'Login Failed',
            {
              timeOut: 3000,
              closeButton: true,
              progressBar: true,
            }
          );
        }
      });
  }

  // = SHOW / HIDE PASSWORD =

  togglePasswordVisibility(): void {

    this.showPassword =
      !this.showPassword;
  }
}