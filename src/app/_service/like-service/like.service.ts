import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const LIKE_API = 'http://localhost:8080/api/v1/likes';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(private http: HttpClient) {}

  createLike(like: any): Observable<any> {
    return this.http.post(LIKE_API, like);
  }

  deleteLike(postId: number, userId:number): Observable<any> {
    return this.http.delete(LIKE_API + '/' + postId +'/' +userId);
  }

  getLikes(postId: number, page: number, pageSize: number): Observable<any> {
    let param = new HttpParams();
    param = param.append('page', page);
    param = param.append('page-size', pageSize);
    return this.http.get(LIKE_API + '/post-id/' + postId, {params: param});
  }
}

