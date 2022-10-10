import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { FriendService } from '../_service/friend-service/friend.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  searchChange = new BehaviorSubject('');
  selectIndex: number = 0;
  profile: any = {};
  user: any;
  profileSearch: any;
  searchContent:string='';
  isTyping:boolean=false;
  constructor(
    private profileService: ProfileService,
    private dataService: DataService,
    private msg: NzMessageService,
    private authService: AuthenticationService,
    private websocket: WebsocketService,
    private friendService: FriendService
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    await this.getProfile(this.user.id);
    this.websocket._connect(this.user.id);
    this.searchChange.pipe(
      debounceTime(1000))
      .subscribe(model => {
        this.findProfileByPhoneNumber(model);
      });

    this.dataService.receiveProfileFriend.subscribe(profileFriend=>{
      this.selectIndex = 3;
    })
  }

  ngOnDestroy(): void {
    this.websocket._disconnect();
  }

  async getProfile(id: number) {
    await this.profileService.getProfile(id).toPromise().then(
      (res) => {
        if (res.success && res.code == 200) {
            this.profile = res.data;
            this.dataService.sendProfile(this.profile);
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err);
      }
    );
  }

  onClickProfile() {
    this.selectIndex = 1;
  }

  onClickChat() {
    this.selectIndex = 2;
  }

  onClickNewssFeed() {
    this.selectIndex = 0;
  }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }

  findProfileByPhoneNumber(phoneNumber:string){
    this.profileService.findByPhoneNumber(phoneNumber).subscribe((res:any)=>{
      if(res.success && res.code == 200){
        this.profileSearch = res.data;
        } else this.profileSearch = null;
      })
  }

  onSearch(){
    this.searchChange.next(this.searchContent);
  }

  async onClickFriend(){
    this.dataService.sendProfileFriend(this.profileSearch);
    this.selectIndex=3;
  }
}
