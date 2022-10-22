import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const PROFILE_API = 'http://localhost:8080/api/v1/profiles';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<any> {
    return this.http.get(PROFILE_API + '/' + id);
  }

  findByPhoneNumber(phoneNumber: string): Observable<any> {
    let param = new HttpParams();
    param = param.append('phone-number', phoneNumber);

    return this.http.get(PROFILE_API + '/phone-number', { params: param });
  }

  findByFullTextSearch(
    idMe: number,
    fullTextSearch: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    let param = new HttpParams();
    param = param.append('full-text-search', fullTextSearch);
    param = param.append('page', page);
    param = param.append('page-size', pageSize);

    return this.http.get(PROFILE_API + '/search/' + idMe, { params: param });
  }

  createProfile(profile: any, file?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('avatar', file);
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
    formdata.append('avatar', file);
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

  updateActiveStatus(id: number, activeStatus: string): Observable<any> {
    return this.http.put(PROFILE_API + '/active/' + id+'?active-status='+activeStatus,{});
  }

  deleteProfile(id: number): Observable<any> {
    return this.http.delete(PROFILE_API + '/' + id);
  }
}
