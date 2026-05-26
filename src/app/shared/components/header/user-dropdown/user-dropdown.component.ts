import {
  Component,
  inject
} from '@angular/core';

import { DropdownComponent } from '../../ui/dropdown/dropdown.component';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';

import { AuthService } from '../../../../core/services/auth.service';

import { TokenService } from '../../../../core/models/token.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,

  selector: 'app-user-dropdown',

  templateUrl: './user-dropdown.component.html',

  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemTwoComponent
  ]
})

export class UserDropdownComponent {

  isOpen = false;

  private authService =
    inject(AuthService);

  private tokenService =
    inject(TokenService);

  private router =
    inject(Router);

  private toastr =
    inject(ToastrService);

 
  // TOGGLE
 

  toggleDropdown() {

    this.isOpen = !this.isOpen;
  }

 
  // CLOSE
 

  closeDropdown() {

    this.isOpen = false;
  }

 
  // LOGOUT
 

  logout(): void {

    const refreshToken =
      this.tokenService
      .getRefreshToken();

    const payload = {

      refreshToken:
        refreshToken
    };

    this.authService
      .logout(payload)

      .subscribe({

        next: (response) => {

          console.log(
            'Logout Success:',
            response
          );

          this.tokenService
            .clearTokens();

          this.authService
            .clearCurrentUser();

          this.toastr.success(
            'Logout Successful'
          );

          this.router.navigate([
            '/signin'
          ]);
        },

        error: (error) => {

          console.log(
            'Logout Error:',
            error
          );

          // EVEN IF API FAILS
          // CLEAR EVERYTHING

          this.tokenService
            .clearTokens();

          this.authService
            .clearCurrentUser();

          this.router.navigate([
            '/signin'
          ]);
        }
      });
  }
}