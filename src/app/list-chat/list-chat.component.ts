import { Component, Input, OnInit} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { MessageService } from '../_service/message-service/message.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.css'],
})
export class ListChatComponent implements OnInit {
  @Input() messagesNotSeen:any[] = [];
  friends: any[] = [];
  listFriendShow: any[] = [];
  chatingWith:any;
  user: any;
  index!: any;
  fullTextSearch: string = '';
  isSearch: boolean = false;
  pageFriend!: number;
  totalPageFriend!: number;
  pageSearch!: number;
  totalPageSearch!: number;
  throttle = 300;
  scrollDistance = 1;
  constructor(
    private messageService: MessageService,
    private msg: NzMessageService,
    private dataService: DataService,
    private profileService: ProfileService,
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.pageFriend=0;
    await new Promise(r => setTimeout(r, 500));
    this.getListFriendChat(this.user.id,this.pageFriend);
    // this.dataService.receiveIndexView.subscribe((i) => {
    //   if (i == 2) {
    //     // this.listFriendShow = this.friends;
    //   }
    // });
    this.dataService.receiveChatWith.subscribe((chatWith) => {
      for (let i = 0; i < this.listFriendShow.length; i++) {
        if (this.listFriendShow[i].id == chatWith.id) {
          this.index = i;
          this.chatingWith = chatWith;
          this.listFriendShow[i].isNotSeen=false;
          break;
        } else this.index=null;
      }
    });
    this.dataService.receiveFirstChat.subscribe((firstChat) => {
      if (firstChat.id != this.listFriendShow[0].id) {
        this.listFriendShow = this.listFriendShow.filter((friend) => {
          return friend.id != firstChat.id;
        });
        this.listFriendShow = [firstChat, ...this.listFriendShow];
        this.listFriendShow.pop();
        this.friends.pop();
        if(firstChat.is_send && firstChat.id != this.chatingWith.id){
          this.index++;
          firstChat.isNotSeen = true;
        }else {
          this.index = 0;
        }
      }
    });
    this.dataService.receiveActiveStatusFriend.subscribe((msg) => {
      this.friends.forEach((friend) => {
        if (friend.id == msg.sender_id) {
          friend.active_status = msg.content;
        }
      });
    });

    this.dataService.receiveSenderId.subscribe(senderId=>{
      if(senderId != this.listFriendShow[0].id){
        this.profileService.getProfile(senderId).subscribe(res=>{
          if(res.success && res.code == 200){
            const chatWith = {
              id:res.data.id,
              name:res.data.name,
              avatar_url:res.data.avatar_url,
              active_status:res.data.active_status,
              is_send:true
            }
            this.dataService.sendFirstChat(chatWith);
          }
        })
      } else this.listFriendShow[0].isNotSeen = true;
    })
  }

  getListFriendChat(id: number, page: number) {
    this.messageService.getListFriendChat(id, page, 20).subscribe(
      (res) => {
        if (res.success && res.code == 200) {
          res.data = this.messageNotSeenFilter(res.data);
          this.pageFriend=page;
          this.totalPageFriend = res.pagination.total_page;
          if(this.pageFriend==0){
            this.friends = res.data;
          } else{
            this.friends = [...this.friends,...res.data];
          }
          
          this.listFriendShow = this.friends;
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err);
      }
    );
  }

  getFriend(id:number):any{
    return this.profileService.getProfile(id).subscribe
  }

  onClickChat(chat: any, i: number) {
    if (this.index != i) {
      if(chat.isNotSeen){
        chat.isNotSeen = false;
      }
      const chatWith = {
        id: chat.id,
        name: chat.name,
        avatar_url: chat.avatar_url,
        active_status: chat.active_status,
      };
      this.dataService.sendChatWith(chatWith);
    }
  }

  onSearch() {
    this.index = null;
    if (this.fullTextSearch != '') {
      this.pageSearch=0;
      this.searchFriendChat(this.fullTextSearch, this.pageSearch);
    } else {
      this.isSearch = false;
      this.listFriendShow = this.friends;
    }
  }

  searchFriendChat(fullTextSearch: string, page: number){
    this.messageService
        .findByFullTextSearch(this.user.id, fullTextSearch, page, 20)
        .subscribe((res) => {
          if (res.success && res.code == 200) {
            this.isSearch = true;
            this.pageSearch=res.pagination.page;
            this.totalPageSearch = res.pagination.total_page;
            res.data = this.messageNotSeenFilter(res.data);
            if(this.pageSearch == 0){
              this.listFriendShow = res.data;
            } else{
              this.listFriendShow = [...this.listFriendShow,...res.data];
            }
            
          } else this.msg.error(res.message);
        });
  }

  onScrollDown(){
    if(this.isSearch){
      this.pageSearch++;
      if(this.pageSearch<=this.totalPageSearch-1){
      this.searchFriendChat(this.fullTextSearch,this.pageSearch);
      }
    } else{
      this.pageFriend++;
      if(this.pageFriend<=this.totalPageFriend-1){
        this.getListFriendChat(this.user.id,this.pageFriend);
      }
    }
  }

   messageNotSeenFilter(listChat:any[]):any{
      listChat.forEach(chat=>{
        for(let i=0;i<this.messagesNotSeen.length;i++){
          if(chat.id == this.messagesNotSeen[i].sender_id){
            chat.isNotSeen = true;
            break;
          }
        }
      })
      return listChat;
    }
}
