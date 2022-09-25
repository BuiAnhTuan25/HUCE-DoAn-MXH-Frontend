import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

    constructor(private msg:NzMessageService){}
    user:any=JSON.parse(localStorage.getItem('auth-user')!);
    // authToken:any=localStorage.getItem('auth-token')!;
    webSocketEndPoint: string = 'http://localhost:8080/notification';

    queue: string = '/queue/notification/' ;
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
        this.stompClient.send("/queue/notification/"+message.to, {}, JSON.stringify(message));
    }


    onMessageReceived(message:any) {
        if(this.user){
            this.msg.success(message.body);
        }
    }

}