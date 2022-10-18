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
      COMMENT_API + '/post-id/'+ postId +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }


  createComment(comment: any,file?:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('picture', file);
    formdata.append('userId', comment.user_id);
    formdata.append('postId', comment.post_id);
    formdata.append('content', comment.content);
    formdata.append('name', comment.name);
    formdata.append('avatarUrl', comment.avatar_url);

    return this.http.post(COMMENT_API, formdata);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(COMMENT_API + '/' + id);
  }
}