import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  selectIndex:number=0;
  profile: any = {};
  user: any;
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private dataService: DataService,
    private msg: NzMessageService,
    private authService: AuthenticationService,
    private websocket: WebsocketService,
    private tokenStorage: TokenStorageService
  ) {}

   ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.getProfile(this.user.id);
    this.websocket._connect(this.user.id);
    
  }

  ngOnDestroy(): void {
    this.websocket._disconnect();
  }

  getProfile(id: number) {
    this.profileService.getProfile(id).subscribe(res=>{
      if (res.success) {
        this.profile = res.data;
        this.tokenStorage.savePofileUser(this.profile);
      } else this.msg.error('Get profile failed!');
    },err => {
      this.msg.error(err);
    });
  }
        

  onClickProfile() {
    this.selectIndex=1;
  }

  onClickChat() {
    this.selectIndex=2;
  }

  onClickNewssFeed(){
    this.selectIndex=0;
  }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }
}
