import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { PRIVACY } from '../_model/privacy';
import { CommentService } from '../_service/comment-service/comment.service';
import { DataService } from '../_service/data-service/data.service';
import { LikeService } from '../_service/like-service/like.service';
import { PostService } from '../_service/post-service/post.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Output() postUpdate = new EventEmitter<any>();
  @Output() postDelete = new EventEmitter<any>();
  @Output() postShare = new EventEmitter<any>();
  @Input() post: any = {};
  @Input() profile: any = {};
  user: any = {};
  postId: any;
  postSelect: any;
  postForm!: FormGroup;
  isVisible: boolean = false;
  isVisibleComment: boolean = false;
  file: any;
  isLoading: boolean = false;
  loading: boolean = false;
  isShare: boolean = false;
  pictureUrl: String = '';
  listComment: any[] = [];
  commentContent: string = '';
  commentSelect: any;
  typeContext = '';
  isLoadingComment: boolean = false;
  isShowMore = true;
  titleModal: string = '';
  likes: any[] = [];
  throttle = 300;
  scrollDistance = 1;
  pageLike: number = 0;
  totalPageLike: number = 0;
  constructor(
    private postService: PostService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private profileService: ProfileService,
    private dataService: DataService,
    private nzContextMenuService: NzContextMenuService,
    public websocket: WebsocketService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.getPostById(this.postId);
    }
    this.initForm();
  }
  initForm() {
    this.postForm = this.fb.group({
      id: [''],
      author_id: [this.user.id],
      content: [''],
      count_likes: [0],
      picture_url: [''],
      privacy: [PRIVACY.PUBLIC],
      posting_time: [''],
      is_share: [false],
    });
  }

  goBackHome() {
    this.router.navigate(['home']);
  }

  onOpenContextMenu(data: any) {
    this.postSelect = data;
    this.typeContext = 'post';
  }

  openModalEdit(isShare: boolean) {
    this.isShare = isShare;
    this.isVisible = true;
    if (isShare) {
      this.titleModal = 'Share post';
      this.initForm();
      this.postForm.controls['is_share'].setValue(true);
      if (this.post.is_share) {
        this.postForm.controls['content'].setValue(this.post.content);
      } else {
        this.postForm.controls['content'].setValue(
          'http://localhost:4200/post/' + this.post.id
        );
      }
    } else {
      this.titleModal = 'Update post';
      this.postForm.patchValue(this.postSelect);
      this.pictureUrl = this.postSelect.picture_url;
    }
  }
  closeModalEdit() {
    this.isVisible = false;
    this.isLoading = false;
    this.postForm.reset();
  }

  getPostById(id: any) {
    this.postService.getPost(id, this.user.id).subscribe((res) => {
      if (res.success && res.code == 200) {
        this.post = res.data;
      } else this.msg.error(res.message);
    });
  }

  savePost() {
    if (this.isShare) {
      this.share();
    } else this.update();
  }

  update() {
    this.isLoading = true;
    this.postService
      .updatePost(
        this.postForm.value,
        this.postForm.controls['id'].value,
        this.file
      )
      .subscribe(
        (res) => {
          if (res.success && res.code == 200) {
            this.isLoading = false;
            this.postUpdate.emit(res.data);
            this.msg.success('Update post successfully!');
            this.closeModalEdit();
          } else {
            this.isLoading = false;
            this.msg.error(res.message);
          }
        },
        (err) => {
          this.isLoading = false;
          this.msg.error(err.detail);
        }
      );
  }

  deletePost() {
    this.postService.deletePost(this.postSelect.id).subscribe(
      (res: any) => {
        if (res.success && res.code == 200) {
          this.postDelete.emit(res.data.id);
          this.msg.success('Delete post successfully!');
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err.detail);
      }
    );
  }

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
      this.file = file;
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.pictureUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  onClickLike() {
    if (this.post.is_like) {
      this.likeService
        .deleteLike(this.post.id, this.user.id)
        .subscribe((res) => {
          if (res.success && res.code == 200) {
            this.post.is_like = false;
            this.post.count_likes--;
          } else this.msg.error(res.message);
        });
    } else {
      const like = {
        post_id: this.post.id,
        user_id: this.user.id,
      };
      this.likeService.createLike(like).subscribe((res) => {
        if (res.success && res.code == 200) {
          this.post.is_like = true;
          this.post.count_likes++;
        } else this.msg.error(res.message);
      });
    }
  }

  onClickComment() {
    this.isVisibleComment = !this.isVisibleComment;
    const id = this.postId ? this.postId : this.post.id;
    this.getListCommentByPostId(id);
    this.commentsFilter(id);
  }

  getListCommentByPostId(id: number) {
    this.commentService.getListCommentByPostId(id, 0, 20).subscribe((res) => {
      if (res.success && res.code == 200) {
        this.listComment = res.data;
      } else this.msg.error(res.message);
    });
  }

  onClickUser(id: number) {
    if (id != this.user.id) {
      this.profileService.getProfile(id).subscribe((res) => {
        if (res.success && res.code == 200) {
          this.dataService.sendProfileFriend(res.data);
        } else this.msg.error(res.message);
      });
    } else this.dataService.sendIndexView(1);
  }

  onDeleteImageSelect() {
    this.pictureUrl = '';
    this.file = null;
  }

  onCreateComment() {
    if (this.commentContent || this.file) {
      const comment = {
        user_id: this.profile.id,
        content: this.commentContent,
        post_id: this.post.id,
        name: this.profile.name,
        avatar_url: this.profile.avatar_url,
      };
      this.isLoadingComment = true;
      this.commentService.createComment(comment, this.file).subscribe((res) => {
        if (res.success && res.code == 200) {
          this.isLoadingComment = false;
          this.commentContent = '';
          // this.listComment = [res.data, ...this.listComment];
          this.onDeleteImageSelect();
        } else {
          this.isLoadingComment = false;
          this.msg.error(res.message);
          this.onDeleteImageSelect();
        }
      });
    }
  }

  onDeleteComment(id?: number) {
    const idDelete = id ? id : this.commentSelect.id;
    this.commentService.deleteComment(idDelete).subscribe((res) => {
      if (res.success && res.code == 200) {
        const index = this.listComment.findIndex((c) => c.id == res.data.id);
        this.listComment.splice(index, 1);
        this.msg.success(res.message);
      } else this.msg.error(res.message);
    });
  }

  contextMenu(
    $event: MouseEvent,
    menu: NzDropdownMenuComponent,
    data: any
  ): void {
    this.nzContextMenuService.create($event, menu);
    this.commentSelect = data;
    this.typeContext = 'comment';
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
    this.commentSelect = null;
    this.postSelect = null;
  }

  commentsFilter(id: number) {
    this.websocket.receiverComment = this.websocket.receiverComment.filter(
      (c) => {
        c.id != id;
      }
    );
  }

  onClickReadMore() {
    this.isShowMore = !this.isShowMore;
  }

  share() {
    this.isLoading = true;
    this.postService.createPost(this.postForm.value).subscribe(
      (res) => {
        if (res.success) {
          this.isLoading = false;
          this.msg.success(res.message);
          this.closeModalEdit();
          this.postShare.emit(res.data);
        } else {
          this.isLoading = false;
          this.msg.error(res.message);
        }
      },
      (err) => {
        this.isLoading = false;
        this.msg.error(err.detail);
      }
    );
  }

  getLikes() {
    this.likeService
      .getLikes(this.post.id, this.pageLike, 20)
      .subscribe((res) => {
        if (res.success) {
          if (this.pageLike == 0) this.likes = res.data;
          else this.likes = [...this.likes, ...res.data];
          this.totalPageLike = res.pagination.total_page;
        }
      });
  }

  onScrollLikesDown() {
    this.pageLike++;
    if (this.pageLike <= this.totalPageLike - 1) {
      this.getLikes();
    }
  }
}
