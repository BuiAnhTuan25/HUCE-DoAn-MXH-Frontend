import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const COMMENT_API = 'http://localhost:8080/api/v1.0/comments';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getListCommentByPostId(
    postId: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      COMMENT_API + '/post/'+ postId +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }


  createComment(comment: any): Observable<any> {
    return this.http.post(COMMENT_API, comment);
  }

  deletecreateComment(id: number): Observable<any> {
    return this.http.delete(COMMENT_API + '/' + id);
  }
}