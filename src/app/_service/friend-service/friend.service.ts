import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const FRIEND_API = 'http://localhost:8080/api/v1/friends';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private http: HttpClient) {}

  getListFriend(id: number,friendStatus: string, page: number, pageSize: number): Observable<any> {
    return this.http.get(
      FRIEND_API + '/me-id/' + id + '?friend-status='+friendStatus+ '&page=' + page + '&page-size=' + pageSize
    );
  }

  getFriend(meId:number,friendId:number): Observable<any>{
    return this.http.get(FRIEND_API+'/'+meId+'/'+friendId);
  }

  createFriend(friend: any): Observable<any> {
    return this.http.post(FRIEND_API, friend);
  }

  deleteFriend(id: number): Observable<any> {
    return this.http.delete(FRIEND_API + '/' + id);
  }

  updateFriend(friend:any, id: number): Observable<any> {
    return this.http.put(FRIEND_API + '/' + id, friend);
  }
}
