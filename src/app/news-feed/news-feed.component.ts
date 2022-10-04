import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {

 ngOnInit() {
  }
}
