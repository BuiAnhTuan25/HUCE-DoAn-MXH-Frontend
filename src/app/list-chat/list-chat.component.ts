import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { MessageService } from '../_service/message-service/message.service';


@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.css'],
})
export class ListChatComponent implements OnInit {
  @Output() sendChatWith = new EventEmitter<any>();
  friends: any[] = [];
  listFriendShow: any[] = [];
  user: any;
  index!: any;
  fullTextSearch: string = '';
  constructor(
    private messageService: MessageService,
    private msg: NzMessageService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.getListFriendChat(this.user.id);
    this.dataService.receiveIndexView.subscribe((i) => {
      if (i == 2) {
        this.index = null;
        this.listFriendShow=this.friends;
      }
    });
    this.dataService.receiveChatWith.subscribe((chatWith) => {
      for (let i = 0; i < this.listFriendShow.length; i++) {
        if (this.listFriendShow[i].id == chatWith.id) {
          this.index = i;
        }
      }
    });
    this.dataService.receiveFirstChat.subscribe((firstChat) => {
      if (firstChat.id != this.listFriendShow[0].id) {
        this.listFriendShow = this.listFriendShow.filter((friend) => {
          return friend.id != firstChat.id;
        });
        this.listFriendShow = [firstChat, ...this.listFriendShow];
        this.index = 0;
      }
    });
    this.dataService.receiveActiveStatusFriend.subscribe(msg=>{
      this.friends.forEach(friend=>{
        if(friend.id == msg.sender_id){
          friend.active_status = msg.content;
        }
      })
    })
  }

  getListFriendChat(id: number) {
    this.messageService.getListFriendChat(id, 0, 20).subscribe(
      (res) => {
        if (res.success && res.code == 200) {
          this.friends = res.data;
          this.listFriendShow = this.friends;
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err);
      }
    );
  }

  onClickChat(chat: any, i: number) {
    if (this.index != i) {
      const chatWith = {
        id: chat.id,
        name: chat.name,
        avatar_url: chat.avatar_url,
        active_status: chat.active_status
      };
      // this.sendChatWith.emit(chatWith);
      this.dataService.sendChatWith(chatWith);
    }
  }

  onSearch() {
    this.index=null;
    if(this.fullTextSearch != ''){
      this.messageService
      .findByFullTextSearch(this.user.id, this.fullTextSearch, 0, 20)
      .subscribe((res) => {
        if(res.success && res.code == 200){
          this.listFriendShow = res.data;
        } else this.msg.error(res.message);
      });
    } else this.listFriendShow = this.friends;
    
  }
}
