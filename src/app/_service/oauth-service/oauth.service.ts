import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  oauthURL = 'http://localhost:8080/api/v1.0/auth-social';

  constructor(private httpClient: HttpClient) { }

  public google(token: any): Observable<any> {
    const tokenDto={value:token};
    return this.httpClient.post(this.oauthURL + '/google', tokenDto);
  }

  public facebook(token: any): Observable<any> {
    const tokenDto={value:token};
    return this.httpClient.post(this.oauthURL + '/facebook', tokenDto);
  }

}
