import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private chatWith: Subject<any> = new Subject<any>();
  private profile: Subject<any> = new Subject<any>();
  constructor() { }

  public get receiveChatWith() {
    return this.chatWith;
  }

  public sendChatWith(chatWith: any) {
    this.chatWith.next(chatWith);
  }

  public get receiveProfile() {
    return this.profile;
  }

  public sendProfile(profile: any) {
    this.profile.next(profile);
  }
}
