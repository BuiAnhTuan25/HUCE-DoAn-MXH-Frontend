import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const USER_API='http://localhost:8080/api/v1.0/users'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(id: number): Observable<any> {
    return this.http.get(USER_API + '/' + id);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(USER_API, user);
  }

  updateUser(user: any, id: number): Observable<any> {
    
    return this.http.put(USER_API + '/' + id, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(USER_API + '/' + id);
  }
}
