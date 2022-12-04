import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { FriendService } from '../_service/friend-service/friend.service';
import { PostService } from '../_service/post-service/post.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  user: any = {};
  friend: any = {};
  profileFriend: any = {};
  profile: any = {};
  listPosts:any[]=[];
  page!:number;
totalPage!:number;
throttle = 300;
scrollDistance = 1;
errorMessage:string='';
  constructor(
    private dataService: DataService,
    private friendService: FriendService,
    private msg: NzMessageService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.page=0;
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.dataService.receiveProfile.subscribe((profile)=>(this.profile=profile));
    this.dataService.receiveProfileFriend.subscribe((profileFriend) => {
      this.profileFriend = profileFriend;
      this.getFriend(this.user.id, this.profileFriend.id);
      this.getPosts(this.profileFriend.id, this.user.id, this.page)
    });

  }

  getFriend(meId: number, friendId: number) {
    this.friendService.getFriend(meId, friendId).subscribe(
      (res) => {
        if (res.success && res.code == 200) {
          this.friend = res.data;
        } else this.friend=null;
      },
      (err) => {
        this.msg.error(err);
        this.friend=null;
      }
    );
  }

  getPosts(authorId:any, id: number,page: number) {
    this.postService.getPosts(authorId, id, page, 20).subscribe(
      (res) => {
        if(res.success && res.code == 200){
          this.totalPage = res.pagination.total_page;
          if(page==0) this.listPosts = res.data;
          else this.listPosts=[...this.listPosts,...res.data];
        } else this.msg.error(res.message);
      })
    }

  onScrollDown(){
    this.page=this.page+1;
    if(this.page<=this.totalPage-1){
      this.getPosts(this.profileFriend.id, this.user.id, this.page);
    } else this.errorMessage = 'No more posts...';
    
  }
}
