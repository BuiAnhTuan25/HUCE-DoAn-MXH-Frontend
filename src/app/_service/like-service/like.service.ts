import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const LIKE_API = 'http://localhost:8080/api/v1.0/likes';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(private http: HttpClient) {}

  createLike(like: any): Observable<any> {
    return this.http.post(LIKE_API, like);
  }

  deleteLike(id: number): Observable<any> {
    return this.http.delete(LIKE_API + '/' + id);
  }
}

