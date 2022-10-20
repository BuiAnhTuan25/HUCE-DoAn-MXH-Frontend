import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { MessageService } from '../_service/message-service/message.service';
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
  index!:any;
  constructor(private messageService: MessageService,private msg: NzMessageService,private dataService:DataService,private websocket:WebsocketService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.getListFriendChat(this.user.id);
    this.dataService.receiveIndexView.subscribe(i=>{
      if(i==2){
        this.index = null;
      }
    })
    this.dataService.receiveChatWith.subscribe(chatWith=>{
      for(let i=0; i<this.friends.length; i++){
        if(this.friends[i].id == chatWith.id){
          this.index = i;
        }
      }
    });
    this.dataService.receiveFirstChat.subscribe(firstChat=>{
      if(firstChat.id != this.friends[0].id){
        this.friends = this.friends.filter(friend=>{
          return friend.id != firstChat.id;
        });
        this.friends = [firstChat,...this.friends];
        this.index=0;
      }
      })
  }

  getListFriendChat(id:number){
    this.messageService.getListFriendChat(id,0,20).subscribe((res)=>{
      if(res.success && res.code == 200){
        this.friends=res.data;
      } else this.msg.error(res.message);
    },err =>{
      this.msg.error(err);
    });
  }

  onClickChat(chat:any,i:number){
    if(this.index != i){
      const chatWith={
        "id":chat.id,
        "name":chat.name,
        "avatar_url":chat.avatar_url
      }
      // this.sendChatWith.emit(chatWith);
      this.dataService.sendChatWith(chatWith);
    }
    
  }

}
