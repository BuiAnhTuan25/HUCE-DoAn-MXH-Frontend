import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProfileSearchRequest } from '../_model/profile-search-request';
import { DataService } from '../_service/data-service/data.service';
import { PostService } from '../_service/post-service/post.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  request: ProfileSearchRequest = {};
  searchType: string = 'USER';
  contentSearch: string = '';
  user: any = {};
  profile: any = {};
  profiles: any[] = [];
  posts: any[] = [];
  pageProfile: number = 0;
  pagePost: number = 0;
  totalPageProfile!: number;
  totalPagePost!: number;
  throttle = 300;
  scrollDistance = 1;
  errorMessage: string = '';
  constructor(
    private profileService: ProfileService,
    private postService: PostService,
    private dataService: DataService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.dataService.receiveProfile.subscribe((profile) => {
      this.profile = profile;
    });
  }

  onSearch() {
    if (this.searchType == 'USER') {
      this.pageProfile = 0;
      this.searchProfile(this.pageProfile, 20);
    }

    if (this.searchType == 'POST') {
      this.pagePost = 0;
      this.searchPost(this.pagePost, 20);
    }
  }

  searchProfile(page: number, pageSize: number) {
    this.request.idMe = this.user.id;
    this.profileService
      .search(this.request, page, pageSize)
      .subscribe((res) => {
        if (res.success && res.code == 200) {
          this.totalPageProfile = res.pagination.total_page;
          if (page == 0) this.profiles = res.data;
          else this.profiles = [...this.profiles, ...res.data];
        } else this.msg.error(res.message);
      });
  }

  searchPost(page: number, pageSize: number) {
    this.postService
      .search(this.user.id, this.contentSearch, page, pageSize)
      .subscribe((res) => {
        if (res.success && res.code == 200) {
          this.totalPagePost = res.pagination.total_page;
          if (page == 0) this.posts = res.data;
          else this.posts = [...this.posts, ...res.data];
        } else this.msg.error(res.message);
      });
  }



  onScrollDown() {
    if (this.searchType == 'USER') {
      this.pageProfile++;
      if (this.pageProfile <= this.totalPageProfile - 1) {
        this.searchProfile(this.pageProfile, 20);
      } else this.errorMessage = 'No more users...';
    }

    if (this.searchType == 'POST') {
      this.pagePost++;
      if (this.pagePost <= this.totalPagePost - 1) {
        this.searchPost(this.pagePost, 20);
      } else this.errorMessage = 'No more posts...';
    }
  }

  onUpdatePost(post: any) {
    let index = this.posts.findIndex((x) => x.id == post.id);
    this.posts.splice(index, 1, post);
  }

  onDeletePost(id: any) {
    const index = this.posts.findIndex((x) => x.id == id);
    this.posts.splice(index, 1);
  }
}
