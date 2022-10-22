import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ListFriendsComponent } from '../list-friends/list-friends.component';
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
  @ViewChild('appListFriend') appListFriend !: ListFriendsComponent;
  profile:any={};
  user:any={};
  listPosts:any[]=[];
  page!:number;
  totalPage!:number;
  throttle = 300;
  scrollDistance = 1;
  errorMessage:string='';
  selectIndex:number=0;
  constructor(
    private authService: AuthenticationService,
    private websocket: WebsocketService,
    private msg: NzMessageService,
    private dataService: DataService,
    private postService: PostService,
  ) {}

  ngOnInit(){
    this.page=0;
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.dataService.receiveProfile.subscribe(
      (profile) => {
        this.profile = profile;
        this.getListPostByAuthorId(this.profile.id,this.page);
      }
    );
  }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }

  
  getListPostByAuthorId(id:number,page:number){
    this.postService.getPostByAuthorId(id,this.page,20).subscribe(res=>{
      if(res.success && res.code == 200){
        this.totalPage = res.pagination.total_page;
        this.page=page;
        if(page==0) this.listPosts = res.data;
        else this.listPosts=[...this.listPosts,...res.data];
      } else this.msg.error(res.message);
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

  onScrollDown(){
    if(this.selectIndex == 0){
      this.page++;
      if(this.page<=this.totalPage){
        this.getListPostByAuthorId(this.user.id,this.page);
      } else this.errorMessage = 'No more posts...';
      
    }

    if(this.selectIndex == 1){
      if(this.appListFriend.selectIndex == 0){
        this.appListFriend.pageFriended++;
        if(this.appListFriend.pageFriended<=this.appListFriend.totalPageFriended){
          this.appListFriend.getListFriend(this.user.id,'FRIENDED',this.appListFriend.pageFriended);
        }
      }
      if(this.appListFriend.selectIndex == 1){
        this.appListFriend.pageFriendConfirm++;
        if(this.appListFriend.pageFriendConfirm<=this.appListFriend.totalPageFriendConfirm){
          this.appListFriend.getListFriend(this.user.id,'CONFIRM',this.appListFriend.pageFriendConfirm);
        }
      }
    }
    
  }
}
