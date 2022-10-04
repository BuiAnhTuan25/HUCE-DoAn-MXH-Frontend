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
    this.websocket._connect(this.user.id);
    this.dataService.receiveProfile.subscribe((profile)=>(this.profile=profile));
  }

  ngOnDestroy(): void {
    this.websocket._disconnect();
  }

  getListMessage(sender: number, receiver: number) {
    this.messageService
      .getListMessagesFriend(sender, receiver, 0, 999)
      .subscribe((res) => {
        if (res.success) {
          this.listMessages = res.data;
        } else this.msg.error('Get list message failed!');
      });
  }

  receiverChatWith(ev: any) {
    this.chatWith = ev;
    this.getListMessage(this.user.id, this.chatWith.id);
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
