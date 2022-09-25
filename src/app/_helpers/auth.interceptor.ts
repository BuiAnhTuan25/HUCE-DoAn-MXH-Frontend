import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null && this.isHeaderNeeded(req.url)) {
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, token),
      });
    }
    return next.handle(authReq);
  }
  isHeaderNeeded(url: string) {
    if (url === "http://api.ipify.org/?format=json") {
        return false;
    } else {
        return true;
    }
}
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
