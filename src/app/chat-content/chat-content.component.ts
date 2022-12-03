import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ScrollToBottomDirective } from '../_helpers/scroll-to-bottom.derective';
import { DataService } from '../_service/data-service/data.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.css'],
})
export class ChatContentComponent implements OnInit{
  @ViewChild(ScrollToBottomDirective)
  scroll!: ScrollToBottomDirective;
  @Input() chatWith: any;
  @Input() listMessages: any[] = [];
  @Input() profile: any = {};
  @Output() scrollUp = new EventEmitter<any>();

  user: any;
  indexView!:number;
  contentMessage: string = '';
  throttle = 300;
  scrollUpDistance = 1;
  scrollDistance = 1;

  constructor(
    private dataService: DataService,
    public websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.dataService.receiveActiveStatusFriend.subscribe((msg) => {
        if (this.chatWith.id == msg.sender_id) {
          this.chatWith.active_status = msg.content;
        }
    });

  }

  sendMessage() {
    if (this.contentMessage != '') {
      const message = {
        sender_id: this.user.id,
        receiver_id: this.chatWith.id,
        content: this.contentMessage,
        message_type: 'MESSAGE',
        avatar_url:this.profile.avatar_url,
      };
      this.websocket._send(message);
      this.contentMessage = '';
      this.dataService.sendFirstChat(this.chatWith)
    }
  }

  onScrollUp(){
    this.scrollUp.emit();
  }

}
