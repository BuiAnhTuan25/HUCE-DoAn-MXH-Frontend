import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ListChatComponent } from '../list-chat/list-chat.component';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { PostService } from '../_service/post-service/post.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('appListFriend') appListFriend !: ListChatComponent;
  profile:any={};
  listPosts:any[]=[];

  constructor(
    private authService: AuthenticationService,
    private websocket: WebsocketService,
    private msg: NzMessageService,
    private dataService: DataService,
    private postService: PostService,
  ) {}

  ngOnInit(){
    this.dataService.receiveProfile.subscribe(
      (profile) => {
        this.profile = profile;
        this.getListPostByAuthorId(this.profile.id);
      }
    );
  }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }

  getListPostByAuthorId(id:number){
    this.postService.getPostByAuthorId(id,0,9999).subscribe(res=>{
      if(res.success && res.code == 200){
        this.listPosts=res.data;
      } else this.msg.error(res.message);
    },err=>{
      this.msg.error(err.message);
    })
  }
}
