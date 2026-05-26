import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl =
    environment.apiUrl;

  private currentUser:
    any = null;

  constructor(
    private http: HttpClient
  ) {}

 
  // LOGIN API
 

  login(payload: any):
  Observable<any> {

    return this.http.post(

      `${this.apiUrl}/Auth/login`,

      payload
    );
  }

 
  // LOGOUT API
 

  logout(payload: any):
  Observable<any> {

    return this.http.post(

      `${this.apiUrl}/Auth/logout`,

      payload
    );
  }

 
  // REFRESH TOKEN API
 

  refreshToken(
    refreshToken: string
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/Auth/refresh-token`,

      {
        refreshToken
      }
    );
  }

 
  // SAVE USER
 

  setCurrentUser(
    user: any
  ): void {

    this.currentUser = user;
  }

 
  // GET USER
 

  getCurrentUser(): any {

    return this.currentUser;
  }

 
  // CLEAR USER
 

  clearCurrentUser(): void {

    this.currentUser = null;
  }
}