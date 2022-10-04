import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { FriendService } from '../_service/friend-service/friend.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.css']
})
export class ListChatComponent implements OnInit {
  @Output() sendChatWith = new EventEmitter<any>();
  friends:any[]=[];
  user:any;
  index!:number;
  constructor(private friendService: FriendService,private msg: NzMessageService,private dataService:DataService,private websocket:WebsocketService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.getListFriend(this.user.id);
  }

  getListFriend(id:number){
    this.friendService.getListFriend(id,0,9999).subscribe((res)=>{
      if(res.success){
        this.friends=res.data;
      } else this.msg.error('Get list friend failed');
    })
  }

  onClickChat(chat:any,i:number){
    let type;
    if(chat.id_friend) type='friend';
    else type='group';
    this.index=i;
    const chatWith={
      "id":chat.friend_id,
      "type":type,
      "name":chat.name,
      "avatar":chat.avatar_url
    }
    this.sendChatWith.emit(chatWith);
  }

}
