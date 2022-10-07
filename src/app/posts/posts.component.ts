import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { PostService } from '../_service/post-service/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  user: any = {};
  listPosts:any[]=[];
  constructor(
    private dataService: DataService,
    private postService: PostService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.getListPostByAuthorId(this.user.id);
  }

  getListPostByAuthorId(id:number){
    this.postService.getPostByAuthorId(id,0,9999).subscribe(res=>{
      if(res.success && res.code == 200){
        this.listPosts=res.data;
      } else this.msg.error(res.message);
    },err=>{
      this.msg.error(err.message);
    })
  }
}
