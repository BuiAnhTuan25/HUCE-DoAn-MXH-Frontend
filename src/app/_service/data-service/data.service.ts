import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private chatWith: Subject<any> = new Subject<any>();
  private profile: Subject<any> = new Subject<any>();
  private profileFriend: Subject<any> = new Subject<any>();
  private indexView: Subject<any> = new Subject<any>();
  private firstChat: Subject<any> = new Subject<any>();
  private activeStatusFriend: Subject<any> = new Subject<any>();
  
  constructor() {}

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

  public get receiveProfileFriend() {
    return this.profileFriend;
  }

  public sendProfileFriend(profileFriend: any) {
    this.profileFriend.next(profileFriend);
  }

  public get receiveIndexView() {
    return this.indexView;
  }

  public sendIndexView(indexView: any) {
    this.indexView.next(indexView);
  }

  public get receiveFirstChat() {
    return this.firstChat;
  }

  public sendFirstChat(firstChat: any) {
    this.firstChat.next(firstChat);
  }

  public get receiveActiveStatusFriend() {
    return this.activeStatusFriend;
  }

  public sendActiveStatusFriend(activeStatusFriend: any) {
    this.activeStatusFriend.next(activeStatusFriend);
  }
}
