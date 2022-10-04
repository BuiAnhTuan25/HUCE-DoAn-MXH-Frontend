import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { MessageService } from '../_service/message-service/message.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.css'],
})
export class ChatContentComponent implements OnInit, AfterViewInit {
  @Input() chatWith: any;
  @Input() listMessages: any[] = [];
  @ViewChildren('messages') messages!: QueryList<any>;
  @ViewChild('content') content!: ElementRef;
  user: any;
  contentMessage: string = '';
  profile: any = {};

  constructor(
    private msg: NzMessageService,
    private messageService: MessageService,
    private dataService: DataService,
    public websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.profile = JSON.parse(localStorage.getItem('profile-user')!);
    this.messageFilter(this.chatWith.id);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop =
        this.content.nativeElement.scrollHeight;
    } catch (err) {}
  };

  sendMessage() {
    if (this.contentMessage != '') {
      const message = {
        sender_id: this.user.id,
        receiver_id: this.chatWith.id,
        content: this.contentMessage,
        message_type: 'MESSAGE',
      };
      this.websocket._send(message);
      this.contentMessage = '';
    }
  }
  messageFilter(id: number) {
    this.websocket.receiverMessage = this.websocket.receiverMessage.filter(
      (msg) => {
        msg.receiver_id = id;
      }
    );
  }
}
