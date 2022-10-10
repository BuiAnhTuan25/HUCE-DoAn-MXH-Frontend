import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { PRIVACY } from '../_model/privacy';
import { PostService } from '../_service/post-service/post.service';
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
  postSelect:any;
  postForm!: FormGroup;
  isVisible:boolean = false;
  file: any;
  isLoading: boolean = false;
  loading: boolean = false;
  pictureUrl: String = '';
  constructor(
    private postService: PostService,
    private msg: NzMessageService,
    private fb: FormBuilder
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

  afterCreatePost(post:any){
    post.avatar_url = this.profile.avatar_url;
    post.name = this.profile.name;
    this.listPosts = [post,...this.listPosts];
  }

  onOpenContextMenu(data:any){
    this.postSelect = data;
  }

  openModalEdit(){
    this.isVisible = true;
    this.postForm.patchValue(this.postSelect);
  }
  closeModalEdit(){
    this.isVisible = false;
    this.postForm.reset();

  }

  updatePost(){
      this.isLoading=true;
      this.postService.updatePost(this.postForm.value,this.postForm.controls['id'].value,this.file).subscribe(res=>{
        if(res.success && res.code == 200){
          this.isLoading=false;
          let index = this.listPosts.findIndex(x=>x.id == res.data.id)
          this.listPosts.splice(index,1,res.data);
          this.msg.success('Update post successfully!');
        } else {
          this.isLoading=false;
          this.msg.error(res.message);
        }
      },err=>{
        this.isLoading=false;
        this.msg.error(err.detail);
      })
  }

  deletePost() {
    this.postService.deletePost(this.postSelect.id).subscribe(
      (res: any) => {
        if (res.success && res.code == 200) {
          const index = this.listPosts.findIndex((x) => x.id == res.data.id);
          this.listPosts.splice(index, 1);
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
}
