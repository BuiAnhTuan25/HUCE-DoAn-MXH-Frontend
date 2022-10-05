import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
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
    private dataService: DataService
  ) {}

  ngOnInit(){
    this.dataService.receiveProfile.subscribe(
      (profile) => (this.profile = profile)
    );
  }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }

}
