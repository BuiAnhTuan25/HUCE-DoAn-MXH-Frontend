import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const POST_API = 'http://localhost:8080/api/v1/posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getPost(id: number, idMe: number): Observable<any> {
    return this.http.get(POST_API + '/' + idMe +'/'+ id);
  }

  search(
    id: number,
    content: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      POST_API +
        '/search' +
        '?page=' +
        page +
        '&page-size=' +
        pageSize +
        '&id=' +
        id +
        '&content=' +
        content
    );
  }

  getPosts(
    authorId: number,
    id: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      POST_API +
        '/author-id/' +
        authorId +
        '/' + id +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }

  getNewsFeed(
    id: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      POST_API +
        '/news-feed/' +
        id +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }

  createPost(post: any, picture?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('picture', picture);
    formdata.append('id', post.id);
    formdata.append('authorId', post.author_id);
    formdata.append('content', post.content);
    formdata.append('countLikes', post.count_likes);
    formdata.append('pictureUrl', post.picture_url);
    formdata.append('privacy', post.privacy);
    formdata.append('isShare', post.is_share);
    formdata.append('postingTime', post.posting_time);


    return this.http.post(POST_API, formdata);
  }

  updatePost(post: any, id: number, picture?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('picture', picture);
    formdata.append('id', post.id);
    formdata.append('authorId', post.author_id);
    formdata.append('content', post.content);
    formdata.append('countLikes', post.count_likes);
    formdata.append('pictureUrl', post.picture_url);
    formdata.append('privacy', post.privacy);
    formdata.append('isShare', post.is_share);
    formdata.append('postingTime', post.posting_time);

    return this.http.put(POST_API + '/' + id, formdata);
  }

  deletePost(id: number) {
    return this.http.delete(POST_API + '/' + id);
  }
}
