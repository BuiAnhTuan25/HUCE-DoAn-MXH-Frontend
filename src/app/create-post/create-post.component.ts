import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { PRIVACY } from '../_model/privacy';
import { PostService } from '../_service/post-service/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  @Output() post= new EventEmitter<any>();
  postForm!: FormGroup;
  user: any;
  listPosts: any[] = [];
  file: any;
  isLoading: boolean = false;
  loading: boolean = false;
  pictureUrl: String = '';
  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.postForm = this.fb.group({
      id: [''],
      author_id: [this.user.id],
      content: [''],
      count_likes: [0],
      picture_url: [''],
      privacy: [PRIVACY.PUBLIC],
      posting_time: ['']
    });
  }

  getPostByAuthorId(id: number) {
    this.postService.getPostByAuthorId(id, 0, 9999).subscribe(
      (res) => {
        if (res.success && res.code == 200) {
          this.listPosts = res.data;
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err);
      }
    );
  }

  createPost() {
    if (this.postForm.controls['content'].value || this.file) {
      this.isLoading = true;
      this.postService.createPost(this.postForm.value, this.file).subscribe(
        (res) => {
          if (res.success && res.code == 200) {
            this.isLoading = false;
            this.msg.success('Create post successfully!');
            this.postForm.reset();
            this.pictureUrl='';
            this.postForm.controls['privacy'].setValue(PRIVACY.PUBLIC);
            this.post.emit(res.data);
          } else {
            this.isLoading = false;
            this.msg.error(res.message);
          }
        },
        (err) => {
          this.isLoading = false;
          this.msg.error(err);
        }
      );
    }
  }

  // updatePost(){
  //   if(this.postForm.controls['content'].value || this.file){
  //     this.isLoading=true;
  //     this.postService.updatePost(this.postForm.value,this.file).subscribe(res=>{
  //       if(res.success && res.code == 200){
  //         this.isLoading=false;
  //         this.listPosts = [res.data,...this.listPosts];
  //         this.msg.success('Create post successfully!');
  //       } else {
  //         this.isLoading=false;
  //         this.msg.error(res.message);
  //       }
  //     },err=>{
  //       this.isLoading=false;
  //       this.msg.error(err);
  //     })
  //   }
  // }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe(
      (res: any) => {
        if (res.success && res.code == 200) {
          const index = this.listPosts.findIndex((x) => x.id == res.data.id);
          this.listPosts.slice(index, 1);
          this.msg.success('Delete post successfully!');
        } else this.msg.error(res.message);
      },
      (err) => {
        this.msg.error(err);
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
}
