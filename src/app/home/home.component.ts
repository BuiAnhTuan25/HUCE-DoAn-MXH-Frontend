import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { DataService } from '../_service/data-service/data.service';
import { NotificationService } from '../_service/notification-service/notification.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('appChat') appChat !: ChatComponent;
  searchChange = new BehaviorSubject('');
  selectIndex: number = 0;
  profile: any = {};
  user: any;
  profileSearch: any;
  searchContent: string = '';
  isTyping: boolean = false;
  notifications:any [] = [];
  notificationNotSeen: any [] = [];
  constructor(
    private profileService: ProfileService,
    private dataService: DataService,
    private msg: NzMessageService,
    private authService: AuthenticationService,
    public websocket: WebsocketService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    await this.getProfile(this.user.id);
    this.websocket._connect(this.user.id);
    this.websocket._connectTopic();
    this.websocket._connectNotification(this.user.id);
    this.updateActiveStatus(this.user.id, 'ONLINE');
    this.getListNotifocation(this.user.id);
    this.searchChange.pipe(debounceTime(1000)).subscribe((model) => {
      this.findProfileByPhoneNumber(model);
    });

    this.dataService.receiveProfileFriend.subscribe((profileFriend) => {
      this.selectIndex = 3;
    });
    this.dataService.receiveIndexView.subscribe((indexView) => {
      this.selectIndex = indexView;
    });
  }

  ngOnDestroy(): void {
    this.updateActiveStatus(this.user.id, 'OFFLINE');
    this.websocket._disconnect();
  }

  async getProfile(id: number) {
    await this.profileService
      .getProfile(id)
      .toPromise()
      .then(
        (res) => {
          if (res.success && res.code == 200) {
            this.profile = res.data;
            this.dataService.sendProfile(this.profile);
          } else this.msg.error(res.message);
        },
        (err) => {
          this.msg.error(err);
        }
      );
  }

  onClickProfile() {
    this.selectIndex = 1;
    this.dataService.sendIndexView(this.selectIndex);
  }

  onClickChat() {
    if (this.selectIndex != 2) {
      this.selectIndex = 2;
      this.dataService.sendIndexView(2);
    }
  }

  onClickNewssFeed() {
    this.selectIndex = 0;
    this.dataService.sendIndexView(this.selectIndex);

  }

  onClickSearch() {
    this.selectIndex = 4;
    this.dataService.sendIndexView(this.selectIndex);
  }

  logout() {
    this.authService.doLogout();
    this.websocket._disconnect();
  }

  findProfileByPhoneNumber(phoneNumber: string) {
    this.profileService.findByPhoneNumber(phoneNumber).subscribe((res: any) => {
      if (res.success && res.code == 200) {
        this.profileSearch = res.data;
      } else this.profileSearch = null;
    });
  }

  onSearch() {
    this.searchChange.next(this.searchContent);
  }

  clickNotification(noti: any) {
    if(noti.post_id || noti.postId) {
      this.routerPost(noti.postId ? noti.postId : noti.post_id);
    }
    if(noti.friendId || noti.friend_id) {
      this.onClickFriend(noti.friendId ? noti.friendId : noti.friend_id);
    }
  }

  onClickFriend(id: number) {
    this.profileService.getProfile(id).subscribe(res=>{
      if(res.success && res.code == 200){
        this.dataService.sendProfileFriend(res.data);
      } else this.msg.error(res.message);
    })
  }

  updateActiveStatus(id: number, activeStatus: string) {
    this.profileService.updateActiveStatus(id, activeStatus).subscribe();
  }


  getListNotifocation(id: number){
    this.notificationService.getList(id,0,20).subscribe(res=>{
      if(res.success && res.code == 200){
        this.notifications = res.data;
        this.filterNotSeen(this.notifications);
      }
    })
  }

  filterNotSeen(notifications: any[]) {
    this.notificationNotSeen = notifications.filter(n=>{
      return n.status == 'NOT_SEEN';
    })
  }

  onClickNotification(){
    let listId:any[] = [];
    this.notificationNotSeen=[...this.notificationNotSeen,...this.websocket.receiverNotification];
    this.notifications = [...this.websocket.receiverNotification,...this.notifications];
    if(this.notificationNotSeen.length > 0) {
      this.notificationNotSeen.forEach(n=>listId.push(n.id));
      this.notificationService.updateStatus(listId).subscribe(res=>{
        if(res.success && res.code == 200){
          this.notificationNotSeen = [];
          this.websocket.receiverNotification = [];
        }
      });
    }
  }
  routerPost(id: number) {
    this.router.navigate(['/post/'+id]);
  }


  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event: any) {
  // }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
      // this.authService.doLogout();
    this.updateActiveStatus(this.user.id, 'OFFLINE');
  }
}
