import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ListChatComponent } from 'src/app/list-chat/list-chat.component';
import { DataService } from '../data-service/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  receiverMessage: any[] = [];
  receiverNotification: any[] = [];
  receiverComment: any[] = [];
  messageCount: any[] = [];
  constructor(
    private msg: NzMessageService,
    private dataService: DataService,
    private notificationNz: NzNotificationService
  ) {}
  user: any = JSON.parse(localStorage.getItem('auth-user')!);
  // authToken:any=localStorage.getItem('auth-token')!;
  webSocketEndPoint: string = 'http://localhost:8080/message';

  queue: string = '/topic/receiver/';
  topic: string = '/topic/message';
  notification: string = '/topic/notification/'
  stompClient: any;

  _connect(idUser: number) {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      () => {
        _this.stompClient.subscribe(_this.queue + idUser, (msg: any) => {
          _this.onMessageReceived(msg);
        });
        //_this.stompClient.reconnect_delay = 2000;
      }
      // , this.errorCallBack(idUser)
    );
  }

  _connectTopic() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      () => {
        _this.stompClient.subscribe(_this.topic, (msg: any) => {
          _this.onMessageTopicReceived(msg);
        });
        //_this.stompClient.reconnect_delay = 2000;
      }
      // , this.errorCallBack(idUser)
    );
  }

  _connectNotification(id: number) {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      () => {
        _this.stompClient.subscribe(_this.notification + id, (msg: any) => {
          _this.onReceiverNotification(msg);
        });
        //_this.stompClient.reconnect_delay = 2000;
      }
      // , this.errorCallBack(idUser)
    );
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  // errorCallBack(error:any,idUser:number) {
  //     console.log("errorCallBack -> " + error)
  //     setTimeout(() => {
  //         this._connect(idUser);
  //     }, 5000);
  // }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  _send(message: any) {
    this.stompClient.send(
      '/app/chat/' + message.receiver_id,
      {},
      JSON.stringify(message)
    );
  }

  _sendTopic(message: any) {
    this.stompClient.send('/topic/message', {}, JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    let msg: any = JSON.parse(message.body);
    if (msg.message_type == 'MESSAGE') {
      this.receiverMessage.push(msg);
      if (msg.sender_id != this.user.id) {
        this.dataService.sendSenderId(msg.sender_id);
        this.messageCount.push(msg);
      }
      if (this.dataService.friendChat.id == msg.sender_id) {
        this.dataService.sendMessageChatting(msg);
      }
    }
  }

  onReceiverNotification(message: any) {
    let msg: any = JSON.parse(message.body);
    this.receiverNotification = [msg, ...this.receiverNotification];
      this.notificationNz.blank(msg.content,'', { nzPlacement: 'bottomLeft' })
  }

  onMessageTopicReceived(message: any) {
    let msg: any = JSON.parse(message.body);
    if (msg.message_type == 'NOTIFICATION') {
      this.receiverNotification = [msg, ...this.receiverNotification];
      this.notificationNz.blank(msg.content,'', { nzPlacement: 'bottomLeft' })
    } else if (msg.message_type == 'ACTIVE_STATUS') {
      this.dataService.sendActiveStatusFriend(msg);
    } else this.receiverComment = [msg, ...this.receiverComment];
  }
}
