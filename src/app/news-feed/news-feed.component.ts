import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { PostService } from '../_service/post-service/post.service';
import { ProfileService } from '../_service/profile-service/profile.service';


@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
listPosts:any[]=[];
user:any = {};
profile:any = {};
  constructor(
    private dataService: DataService,
    private postService: PostService,
    private msg: NzMessageService,
  ) {}

 ngOnInit() {
  this.user = JSON.parse(localStorage.getItem('auth-user')!);
  this.dataService.receiveProfile.subscribe(
    (profile) => {
      this.profile = profile;
    }
  );
  this.getNewsFeed(this.user.id);
  }

  getNewsFeed(id:number){
    this.postService.getNewsFeed(id,0,9999).subscribe(res=>{
      if(res.success && res.code == 200){
        this.listPosts = res.data;
      } else this.msg.error(res.message);
    })
  }
}
