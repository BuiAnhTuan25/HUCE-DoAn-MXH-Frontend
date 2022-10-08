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
  listPosts:any[]=[];
  constructor(
    private dataService: DataService,
    private friendService: FriendService,
    private msg: NzMessageService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.dataService.receiveProfileFriend.subscribe((profileFriend) => {
      this.profileFriend = profileFriend;
      this.getFriend(this.user.id, this.profileFriend.id);
      this.getListPostByAuthorId(this.profileFriend.id)
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

  getListPostByAuthorId(id: number) {
    this.postService.getPostByAuthorId(id, 0, 9999).subscribe(
      (res) => {
        if (res.success && res.code == 200) {
          this.listPosts = res.data;
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err.message);
      }
    );
  }
}
