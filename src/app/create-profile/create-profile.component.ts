import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { GENDER } from '../_model/gender';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css'],
})
export class CreateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading: boolean = false;
  user: any;
  avatarUrl?: string;
  file!: NzUploadFile;
  loading = false;
  erorrPictire:string='';
  validateFile:boolean=false;


  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private msg: NzMessageService,
    private auth:AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.profileForm = this.fb.group({
      id: [this.user.id],
      name: ['', Validators.required],
      phone_number: ['',Validators.required],
      birthday: ['', Validators.required],
      gender: [GENDER.MALE, Validators.required],
      avatar_url: [''],
      address: [''],
      is_public: [true],
    });
  }

  onClickLogout() {
    this.auth.doLogout();
  }

  checkFile(){
    if (!this.file) {
      this.validateFile = false;
      this.erorrPictire = 'Please select picture!';
    } else {
      this.validateFile = true;
      this.erorrPictire = '';
    }
  }

  createProfile() {
    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }

    this.checkFile();
    
    if(this.validateFile && this.profileForm.valid){
      this.profileService
      .createProfile(this.profileForm.value, this.file)
      .subscribe((res: any) => {
        if (res.success) {
            this.msg.success('Create profile successfully');
            this.router.navigate(['/home']);
        } else this.msg.error('Create profile failed!');
      });
    }
    
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
      this.checkFile();
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
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
