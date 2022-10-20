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
  chatWith: any;
  user: any;
  profile:any={};

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
    this.dataService.receiveProfile.subscribe((profile)=>(this.profile=profile));
    this.dataService.receiveChatWith.subscribe(chatWith=>{
      this.chatWith = chatWith;
      this.getListMessage(this.user.id, this.chatWith.id);
    })
    this.dataService.receiveIndexView.subscribe(i=>{
      if(i==2){
        this.chatWith = null;
      }
    })
  }

  ngOnDestroy(): void {
    this.websocket._disconnect();
  }

  getListMessage(sender: number, receiver: number) {
    this.messageService
      .getListMessagesFriend(sender, receiver, 0, 40)
      .subscribe((res) => {
        if (res.success && res.code == 200) {
          this.listMessages = res.data;
          this.messageFilter();
        } else this.msg.error(res.message);
      },err =>{
        this.msg.error(err);
      });
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
}
