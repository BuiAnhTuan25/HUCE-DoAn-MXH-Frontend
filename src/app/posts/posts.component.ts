import { Component, Input, OnInit } from '@angular/core';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { DataService } from '../_service/data-service/data.service';
// import { PostService } from '../_service/post-service/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Input() profile:any={};
  @Input() listPosts:any[]=[];
  user: any = {};
  constructor(
    // private dataService: DataService,
    // private postService: PostService,
    // private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
  }

  afterCreatePost(post:any){
    post.avatar_url = this.profile.avatar_url;
    post.name = this.profile.name;
    this.listPosts = [post,...this.listPosts];
  }
}
