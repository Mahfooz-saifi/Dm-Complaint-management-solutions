import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class TokenService {

  private accessToken:
    string | null = null;

  private refreshToken:
    string | null = null;

 
  // SAVE TOKENS
 

  setTokens(
    accessToken: string,
    refreshToken: string
  ): void {

    this.accessToken =
      accessToken;

    this.refreshToken =
      refreshToken;

    console.log(
      'Access Token Saved:',
      this.accessToken
    );
  }

 
  // GET ACCESS TOKEN
 

  getAccessToken():
  string | null {

    return this.accessToken;
  }

 
  // GET REFRESH TOKEN
 

  getRefreshToken():
  string | null {

    return this.refreshToken;
  }

 
  // CLEAR TOKENS
 

  clearTokens(): void {

    this.accessToken = null;

    this.refreshToken = null;

    console.log(
      'Tokens Cleared'
    );
  }
}