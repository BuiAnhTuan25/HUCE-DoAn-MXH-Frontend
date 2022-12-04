import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { MessageService } from '../_service/message-service/message.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit,OnDestroy {
  listMessages: any[] = [];
  listMessagesNotSeen: any[] = [];
  listMessageWebsocket:any[]=[];
  indexView:any;
  chatWith: any;
  user: any;
  profile:any={};
  page!:number;
  totalPage!:number;

  constructor(
    private router: Router,
    private msg: NzMessageService,
    private messageService: MessageService,
    private websocket: WebsocketService,
    private dataService: DataService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.page=0;
    this.getListMessagesNotSeen(this.user.id);
    this.dataService.receiveProfile.subscribe((profile)=>(this.profile=profile));
    this.dataService.receiveChatWith.subscribe(chatWith=>{
      this.chatWith = chatWith;
      this.page=0;
      this.getListMessage(this.user.id, this.chatWith.id, this.page);
      this.updateMessageStatus(this.chatWith);
      this.websocket.messageCount = this.websocket.messageCount.filter(m=>{
        return m.sender_id != chatWith.id;
      })
    })
    this.dataService.receiveIndexView.subscribe(index=>{
      this.indexView = index;
      if(this.indexView == 2 && this.listMessageWebsocket.length > 0){
        this.messageChatting(this.listMessageWebsocket);
        this.websocket.messageCount = this.websocket.messageCount.filter(m=>{
          return m.sender_id != this.chatWith.id;
        })
      }
    })
    this.dataService.receiveMessageChatting.subscribe(messageChatting=>{
      if(this.chatWith.id == messageChatting.sender_id && this.indexView == 2){
        this.messageChatting([messageChatting.id]);
        this.websocket.messageCount = this.websocket.messageCount.filter(m=>{
          return m.id != messageChatting.id;
        })
      } else if(this.chatWith.id == messageChatting.sender_id && this.indexView != 2){
        this.listMessageWebsocket.push(messageChatting.id);
      }
    })
  }

  ngOnDestroy(): void {
    this.websocket._disconnect();
  }

  getListMessage(sender: number, receiver: number, page:number) {
    this.messageService
      .getListMessagesFriend(sender, receiver, page, 40)
      .subscribe((res) => {
        if (res.success && res.code == 200) {
          this.page=page;
          this.totalPage = res.pagination.total_page;
          if(this.page == 0){
            this.listMessages = res.data.reverse();
            this.messageFilter();
          } else {
            this.listMessages = [...res.data.reverse(),...this.listMessages];
          }
          
        } else this.msg.error(res.message);
      },err =>{
        this.msg.error(err);
      });
  }

  getListMessagesNotSeen(receiverId:number){
    this.messageService.getListMessagesNotSeen(receiverId).subscribe(res=>{
      if(res.success && res.code == 200){
        this.listMessagesNotSeen = res.data;
      } else this.msg.error(res.message);
    })
  }

  messageFilter() {
    this.websocket.receiverMessage = this.websocket.receiverMessage.filter((msg=>{
      return msg.receiver_id != this.chatWith.id;
    }));
    this.websocket.receiverMessage = this.websocket.receiverMessage.filter((msg=>{
      return msg.sender_id!=this.chatWith.id;
    }));
  }

  onClickHome(){
    this.router.navigate(['/home']);
  }

  onClickProfile(){
    this.router.navigate(['/profile/'+this.user.id]);
  }

  logout(){
    this.authService.doLogout();
    this.websocket._disconnect();
  }

  onScrollUpMessage(){
    this.page++;
    if(this.page<=this.totalPage-1){
      this.getListMessage(this.user.id, this.chatWith.id, this.page);
    }
  }

  receiverListMessage(ev:any){
    this.listMessagesNotSeen = ev;
  }

  updateMessageStatus(chatWith:any){
    let listId = this.getIdMessageNotSeen(chatWith);
    if(listId.length>0){
      this.messageService.updateMessageStatus(listId).subscribe(res=>{
        if(res.success && res.code == 200){
        } else {
          this.msg.error(res.message);
        }
      });
    }
  }

  getIdMessageNotSeen(friendChat:any):any{
    let listId:any[]=[];
    let newListMessage:any[]=[];
    this.listMessagesNotSeen.forEach(m=>{
      if(m.sender_id == friendChat.id){
        listId.push(m.id);
      } else newListMessage.push(m);
    })
    this.listMessagesNotSeen = newListMessage;
    return listId;
  }

  messageChatting(listMessage:any[]){
    if(listMessage.length>0){
      this.messageService.updateMessageStatus(listMessage).subscribe(res=>{
        if(res.success && res.code == 200){
        } else {
          this.msg.error(res.message);
        }
      });
    }
  }
}
