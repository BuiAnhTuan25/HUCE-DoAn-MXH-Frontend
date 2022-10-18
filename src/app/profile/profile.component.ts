import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ListChatComponent } from '../list-chat/list-chat.component';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { PostService } from '../_service/post-service/post.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('appListFriend') appListFriend !: ListChatComponent;
  profile:any={};
  user:any={};
  listPosts:any[]=[];

  constructor(
    private authService: AuthenticationService,
    private websocket: WebsocketService,
    private msg: NzMessageService,
    private dataService: DataService,
    private postService: PostService,
  ) {}

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
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
  
  afterCreatePost(post:any){
    post.avatar_url = this.profile.avatar_url;
    post.name = this.profile.name;
    this.listPosts = [post,...this.listPosts];
  }
  
  onUpdatePost(post:any){
    let index = this.listPosts.findIndex(x=>x.id ==post.id)
    this.listPosts.splice(index,1,post);
  }

  onDeletePost(id:any){
    const index = this.listPosts.findIndex((x) => x.id == id);
    this.listPosts.splice(index, 1);
  }


}
