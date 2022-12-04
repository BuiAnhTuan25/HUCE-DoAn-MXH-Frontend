import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const NOTIFICATION_API = 'http://localhost:8080/api/v1/notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getList(
    idMe: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      NOTIFICATION_API +
        '?id=' +
        idMe +
        '&page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }

  getListNotSeen(id: any): Observable<any> {
    return this.http.get(NOTIFICATION_API + '/not-seen/' + id);
  }

  create(notification: any): Observable<any> {
    return this.http.post(NOTIFICATION_API, notification);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(NOTIFICATION_API + '/' + id);
  }

  updateStatus(listId:any[]): Observable<any>{
    return this.http.put(NOTIFICATION_API+'/list',listId);
  }
}
