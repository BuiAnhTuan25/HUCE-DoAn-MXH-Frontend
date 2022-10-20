import { Component, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { FriendService } from '../_service/friend-service/friend.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-list-friends',
  templateUrl: './list-friends.component.html',
  styleUrls: ['./list-friends.component.css'],
})
export class ListFriendsComponent implements OnInit {
  profile: any = {};
  friends: any[] = [];
  listFriended: any[] = [];
  listFriendConfirm: any[] = [];
  selectFriend:any;
  page!:number;
  totalPage!:number;
  constructor(
    private dataService: DataService,
    private friendService: FriendService,
    private msg: NzMessageService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.page=0;
    this.dataService.receiveProfile.subscribe((profile) => {
      this.profile = profile;
      this.getListFriend(this.profile.id,this.page);
    });
  }

  onOpenContextMenu(data:any){
    this.selectFriend = data;
  }

  getListFriend(id: number,page:number) {
    this.friendService.getListFriend(id, page, 50).subscribe((res) => {
      if (res.success && res.code == 200) {
        this.totalPage = res.pagination.total_page;
        this.friends = res.data;
        this.listFriended = this.friends.filter(
          (friend) => friend.friend_status == 'FRIENDED'
        );
        this.listFriendConfirm = this.friends.filter(
          (friend) => friend.friend_status == 'CONFIRM'
        );
      } else this.msg.error(res.message);
    });
  }

  confirmFriend() {
    this.selectFriend.friend_status = 'FRIENDED';
    this.friendService
      .updateFriend(this.selectFriend, this.selectFriend.id)
      .subscribe((res) => {
        if (res.success && res.code == 200) {
          this.listFriended = [this.selectFriend,...this.listFriended];
          let index = this.listFriendConfirm.findIndex(x=>x.id==this.selectFriend.id);
          this.listFriendConfirm.splice(index,1);
          this.msg.success('Add friend successfully!');
        } else {
          this.msg.error(res.message);
        }
      },err =>{
        this.msg.error(err);
      });
  }

  deleteFriend() {
    this.friendService.deleteFriend(this.selectFriend.id).subscribe((res) => {
      if (res.success && res.code == 200) {
        if(this.selectFriend.friend_status == 'FRIENDED'){
          let index = this.listFriended.findIndex(x=>x.id == this.selectFriend.id);
          this.listFriended.splice(index,1);
        }
        if(this.selectFriend.friend_status == 'CONFIRM'){
          let index = this.listFriendConfirm.findIndex(x=>x.id == this.selectFriend.id);
          this.listFriendConfirm.splice(index,1);
        }
        this.msg.success('Delete friend successfully!');
      } else 
      {
        this.msg.error(res.message);
      }
    },err =>{
      this.msg.error(err);
    });
  }

  onClickFriend(friend:any){
    this.profileService.getProfile(friend.friend_id).subscribe(res=>{
      if(res.success && res.code == 200){
        this.dataService.sendProfileFriend(res.data);
      } else this.msg.error(res.message);
    })
  }
}
