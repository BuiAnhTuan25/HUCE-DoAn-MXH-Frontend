import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { PostService } from '../_service/post-service/post.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
listPosts:any[]=[];
user:any = {};
profile:any = {};
page!:number;
totalPage!:number;
throttle = 300;
scrollDistance = 1;
errorMessage:string='';
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
  this.page=0;
  this.getNewsFeed(this.user.id,this.page);
  }

  getNewsFeed(id:number,page:number){
    this.postService.getNewsFeed(id,page,20).subscribe(res=>{
      if(res.success && res.code == 200){
        this.page=page;
        this.totalPage = res.pagination.total_page;
        if(page==0) this.listPosts = res.data;
        else this.listPosts=[...this.listPosts,...res.data];
      } else this.msg.error(res.message);
    })
  }

  afterCreatePost(post:any){
    post.avatar_url = this.profile.avatar_url;
    post.name = this.profile.name;
    this.listPosts = [post,...this.listPosts];
  }
  
  onUpdatePost(post:any){
    let index = this.listPosts.findIndex(x=>x.id ==post.id)
    this.listPosts.splice(index,1,post);
  }

  onDeletePost(id:any){
    const index = this.listPosts.findIndex((x) => x.id == id);
    this.listPosts.splice(index, 1);
  }

  onScrollDown(){
    this.page++;
    if(this.page<=this.totalPage-1){
      this.getNewsFeed(this.user.id,this.page);
    } else this.errorMessage = 'No more posts...';
    
  }
}
