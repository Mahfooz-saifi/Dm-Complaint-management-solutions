import {

  Injectable,
  inject

} from '@angular/core';

import {

  CanActivateFn,
  Router

} from '@angular/router';
import { TokenService } from '../models/token.service';


@Injectable({
  providedIn: 'root'
})

class AuthGuardService {

  private router =
    inject(Router);

  private tokenService =
    inject(TokenService);

  canActivate(): boolean {

    const token =
      this.tokenService
      .getAccessToken();

    console.log(
      'Guard Token:',
      token
    );

    if (!token) {

      this.router.navigate([
        '/signin'
      ]);

      return false;
    }

    return true;
  }
}

export const authGuard:
CanActivateFn = () => {

  return inject(
    AuthGuardService
  ).canActivate();
};