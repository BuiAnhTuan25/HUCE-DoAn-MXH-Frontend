import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const PROFILE_API = 'http://localhost:8080/api/v1.0/profiles';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(id: number): Observable<any> {
    return this.http.get(PROFILE_API + '/' + id);
  }

  createProfile(profile: any, file?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('id', profile.id);
    formdata.append('name', profile.name);
    formdata.append('phoneNumber', profile.phone_number);
    formdata.append('address', profile.address);
    formdata.append(
      'birthday',
      formatDate(profile.birthday, 'yyyy-MM-dd', 'en_US')
    );
    formdata.append('gender', profile.gender);
    formdata.append('avatarUrl', profile.avatar_url);
    formdata.append('isPublic', profile.is_public);
    return this.http.post(PROFILE_API, formdata);
  }

  updateProfile(profile: any, id: number, file?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('id', profile.id);
    formdata.append('name', profile.name);
    formdata.append('phoneNumber', profile.phone_number);
    formdata.append('address', profile.address);
    formdata.append(
      'birthday',
      formatDate(profile.birthday, 'yyyy-MM-dd', 'en_US')
    );
    formdata.append('gender', profile.gender);
    formdata.append('avatarUrl', profile.avatar_url);
    formdata.append('isPublic', profile.is_public);
    return this.http.put(PROFILE_API + '/' + id, formdata);
  }

  deleteProfile(id: number): Observable<any> {
    return this.http.delete(PROFILE_API + '/' + id);
  }
}
