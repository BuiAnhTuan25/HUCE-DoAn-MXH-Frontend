import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
const AUTH_API = 'http://localhost:8080/api/v1.0/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}
  login(user: any): Observable<any> {
    return this.http.post(AUTH_API + '/login', user);
  }
  
  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + '/register', user);
  }

  registerVeryfy(code:string):Observable<any>{
    let param = new HttpParams();
    param=param.append('code',code);
    return this.http.get(AUTH_API+'/register/verify',{ params : param});
  }

  getToken() {
    return localStorage.getItem('auth-token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('auth-token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('auth-token');
    let removeUser = localStorage.removeItem('auth-user');
    let removeProfile = localStorage.removeItem('profile-user');

    if (removeToken == null && removeUser == null && removeProfile == null) {
      this.router.navigate(['/login']);
    }
  }

  sendEmailChangePassword(mail: string): Observable<any> {
    let param = new HttpParams();
    param = param.append('mail', mail);
    return this.http.get(AUTH_API + '/update-password-token', {
      params: param,
    });
  }

  changePassword(id: number, pass: any): Observable<any> {
    return this.http.put(AUTH_API + '/change-password/'+id, pass);
  }

  sendEmailForgotPassword(mail: string): Observable<any> {
    let param = new HttpParams();
    param = param.append('mail', mail);
    return this.http.get(AUTH_API + '/forgot-password', {
      params: param,
    });
  }
}
