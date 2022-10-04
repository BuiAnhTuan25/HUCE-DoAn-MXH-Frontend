import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile:any={};

  constructor(
    private authService: AuthenticationService,
    private websocket: WebsocketService,
    private msg: NzMessageService,
  ) {}

  ngOnInit(){
    this.profile = JSON.parse(localStorage.getItem('profile-user')!);
  }

  // onClickChat() {
  //   this.router.navigate(['/chat']);
  // }

  // onClickHome() {
  //   this.router.navigate(['/home']);
  // }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }

}
