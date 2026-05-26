import {

  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest

} from '@angular/common/http';

import { inject } from '@angular/core';

import {

  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError

} from 'rxjs';

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth.service';

import { TokenService } from '../models/token.service';

let isRefreshing = false;

const refreshTokenSubject =
  new BehaviorSubject<string | null>(null);

export const authInterceptor:
HttpInterceptorFn = (

  req: HttpRequest<any>,

  next: HttpHandlerFn

) => {

  const tokenService =
    inject(TokenService);

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const toastr =
    inject(ToastrService);

 
  // SKIP LOGIN + REFRESH
 

  if (

    req.url.includes('/Auth/login') ||

    req.url.includes('/Auth/refresh-token')

  ) {

    return next(req);
  }

 
  // ACCESS TOKEN
 

  const token =
    tokenService.getAccessToken();

 
  // ATTACH TOKEN
 

  if (token) {

    req = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`
      }
    });
  }

 
  // SEND REQUEST
 

  return next(req).pipe(

    catchError((error:
      HttpErrorResponse) => {

      console.log(
        'GLOBAL API ERROR:',
        error
      );

     
      // 401 UNAUTHORIZED
     

      if (error.status === 401) {

        return handle401Error(

          req,

          next,

          tokenService,

          authService,

          router,

          toastr
        );
      }

     
      // 403 FORBIDDEN
     

      else if (error.status === 403) {

        toastr.error(
          'Access Denied'
        );
      }

     
      // 404 NOT FOUND
     

      else if (error.status === 404) {

        toastr.error(
          'API Not Found'
        );
      }

     
      // 500 SERVER ERROR
     

      else if (error.status === 500) {

        toastr.error(
          'Internal Server Error'
        );
      }

     
      // NETWORK ERROR
     

      else if (error.status === 0) {

        toastr.error(
          'Server Unreachable'
        );
      }

     
      // OTHER ERRORS
     

      else {

        toastr.error(

          error?.error?.message ||

          error?.error?.msg ||

          'Something Went Wrong'
        );
      }

      return throwError(
        () => error
      );
    })
  );
};

function handle401Error(

  request: HttpRequest<any>,

  next: HttpHandlerFn,

  tokenService: TokenService,

  authService: AuthService,

  router: Router,

  toastr: ToastrService

) {

  if (!isRefreshing) {

    isRefreshing = true;

    refreshTokenSubject.next(null);

    const refreshToken =
      tokenService.getRefreshToken();

   
    // NO REFRESH TOKEN
   

    if (!refreshToken) {

      isRefreshing = false;

      tokenService.clearTokens();

      authService.clearCurrentUser();

      router.navigate([
        '/signin'
      ]);

      return throwError(
        () => new Error(
          'No Refresh Token'
        )
      );
    }

   
    // REFRESH TOKEN API
   

    return authService

      .refreshToken(refreshToken)

      .pipe(

        switchMap((response: any) => {

          isRefreshing = false;

          const newAccessToken =
            response?.msg?.token;

          const newRefreshToken =
            response?.msg?.refreshToken;

         
          // SAVE NEW TOKENS
         

          tokenService.setTokens(

            newAccessToken,

            newRefreshToken
          );

          refreshTokenSubject.next(
            newAccessToken
          );

         
          // RETRY ORIGINAL REQUEST
         

          return next(

            request.clone({

              setHeaders: {

                Authorization:
                  `Bearer ${newAccessToken}`
              }
            })
          );
        }),

        catchError((error) => {

          isRefreshing = false;

          tokenService.clearTokens();

          authService.clearCurrentUser();

          toastr.error(
            'Session Expired'
          );

          router.navigate([
            '/signin'
          ]);

          return throwError(
            () => error
          );
        })
      );
  }

 
  // MULTIPLE API REQUESTS
 

  return refreshTokenSubject.pipe(

    filter(token => token != null),

    take(1),

    switchMap((token) => {

      return next(

        request.clone({

          setHeaders: {

            Authorization:
              `Bearer ${token}`
          }
        })
      );
    })
  );
}