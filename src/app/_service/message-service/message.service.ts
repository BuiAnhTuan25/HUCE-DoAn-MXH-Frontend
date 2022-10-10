import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const MESSAGE_API = 'http://localhost:8080/api/v1.0/messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  getListMessagesFriend(
    idMe: number,
    idFriend: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      MESSAGE_API +
        '/history/' +
        idMe +
        '/' +
        idFriend +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }

  getListMessagesGroup(
    idGroup: any,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      MESSAGE_API +
        '/history/' +
        idGroup +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }

  createMessage(message: any): Observable<any> {
    return this.http.post(MESSAGE_API, message);
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(MESSAGE_API + '/' + id);
  }
}
