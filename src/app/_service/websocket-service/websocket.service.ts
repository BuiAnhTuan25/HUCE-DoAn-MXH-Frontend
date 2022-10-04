import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    receiverMessage:any[]=[];
    constructor(private msg:NzMessageService){}
    user:any=JSON.parse(localStorage.getItem('auth-user')!);
    // authToken:any=localStorage.getItem('auth-token')!;
    webSocketEndPoint: string = 'http://localhost:8080/message';

    queue: string = '/topic/receiver/' ;
    stompClient: any;
    
    _connect(idUser:number) {
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
       _this.stompClient.connect({},()=> {
            _this.stompClient.subscribe(_this.queue+idUser, (msg:any)=> {
                _this.onMessageReceived(msg);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }
        // , this.errorCallBack(idUser)
        );
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
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
    _send(message:any) {
        this.stompClient.send("/app/chat/"+message.receiver_id, {}, JSON.stringify(message));
    }


    onMessageReceived(message:any) {
        let msg:any=JSON.parse(message.body);
        this.receiverMessage.push(msg);
    }

}