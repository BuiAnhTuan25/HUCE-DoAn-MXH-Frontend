import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { NoSpace, PHONE_NUMBER_REGEX } from '../_helpers/validator';
import { FriendService } from '../_service/friend-service/friend.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
import { UserService } from '../_service/user-service/user.service';

@Component({
  selector: 'app-personal-infomation',
  templateUrl: './personal-infomation.component.html',
  styleUrls: ['./personal-infomation.component.css'],
})
export class PersonalInfomationComponent implements OnInit {
  @Input() profile: any;
  isPublic = true;
  user: any;
  friend: any;
  isVisibleEdit:boolean=false;
  editForm!:FormGroup;
  passwordForm!:FormGroup;
  file:any;
  loading:boolean=false;
  avatarUrl:string='';
  isLoading:boolean=false;
  isVisiblePassword:boolean=false;
  confirmPassword:boolean=false;
  checkPassword:boolean=false;
  constructor(
    private friendService: FriendService,
    private msg: NzMessageService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) {}



  ngOnInit(): void {
    this.editForm=this.fb.group({
        id:['', Validators.required],
        name: ['', Validators.required],
        phone_number: ['',[Validators.required,Validators.pattern(PHONE_NUMBER_REGEX)]],
        birthday: ['', Validators.required],
        gender: ['', Validators.required],
        avatar_url: [''],
        address: [''],
        is_public: [''],
  })
  this.passwordForm=this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, NoSpace]],
    confirmPassword: ['', [Validators.required, NoSpace]],
})
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    
    // this.getProfile(this.profileId);
    // if (this.user.id != this.profileId) {
    //   this.getFriend(this.user.id, this.profileId);
    // }
  }

  getFriend(meId: number, friendId: number) {
    this.friendService.getFriend(meId, friendId).subscribe((res) => {
      if (res.success) {
        this.friend = res.data;
      } else this.msg.error('Get friend failed!');
    });
  }

  getProfile(id: number) {
    this.profileService.getProfile(id).subscribe((res) => {
      if (res.success) {
        this.profile = res.data;
      } else this.msg.error('Get profile failed!');
    });
  }

  createFriend() {
    const friend = {
      me_id: this.user.id,
      friend_id: this.profile.id,
    };
    this.friendService.createFriend(friend).subscribe((res) => {
      if (res.success) {
        this.friend = res.data;
      } else this.msg.error('Add friend failed!');
    });
  }

  confirmFriend() {
    this.friend.friend_status = 'FRIENDED';
    this.friendService
      .updateFriend(this.friend, this.friend.id)
      .subscribe((res) => {
        if (res.success) {
          this.friend = res.data;
          this.msg.success('Add friend successfully!');
        } else this.msg.error('Add friend failed!');
      });
  }

  deleteFriend() {
    this.friendService.deleteFriend(this.friend.id).subscribe((res) => {
      if (res.success) {
        this.friend = null;
        this.msg.success('Delete friend successfully!');
      } else this.msg.error('Delete friend failed!');
    });
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
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  onSaveInfomation(){
    for (const i in this.editForm.controls) {
      this.editForm.controls[i].markAsDirty();
      this.editForm.controls[i].updateValueAndValidity();
    }
    if (this.editForm.valid) {
      this.isLoading = true;

    this.profileService.updateProfile(this.editForm.value,this.editForm.controls['id'].value,this.file).subscribe((res)=>{
      if(res.success){
        this.isLoading=false;
        this.profile=res.data;
        this.isVisibleEdit=false;
        this.msg.success('Update personal information successfully!')
      } else {
        this.isLoading=false;
        this.msg.error('Update personal information failed!')
      }
    });
  }
}

  openModalEdit(){
    this.isVisibleEdit=true;
    this.editForm.patchValue(this.profile);
    this.avatarUrl=this.profile.avatar_url;
  }

  handleCancelEdit(){
    this.isVisibleEdit = false;
    this.editForm.reset();
    this.avatarUrl='';
  }

  openChangePassword(){
    this.isVisiblePassword=true;
    this.passwordForm.reset();
  }

  closePassword(){
    this.isVisiblePassword=false;
    this.passwordForm.reset();
  }

  onSavePassword(){
    for (const i in this.passwordForm.controls) {
      this.passwordForm.controls[i].markAsDirty();
      this.passwordForm.controls[i].updateValueAndValidity();
    }

    this.checkConfirmPassword();
    this.doCheckPassword();

    if (this.passwordForm.valid && this.confirmPassword && this.checkPassword) {
      this.isLoading = true;
      this.user.password=this.passwordForm.controls['newPassword'].value;
      this.userService.updatePassword(this.user.id,this.user).subscribe((res)=>{
        if(res.success){
          this.isLoading=false;
          this.tokenStorage.saveUser(res.data);
          this.user=res.data;
          this.isVisiblePassword=false;
          this.msg.success('Change password successfully!');
        } else {
          this.isLoading=false;
          this.msg.error('Change password failed!');
        }
      });
  }
}

  checkConfirmPassword() {
    if (
      this.passwordForm.controls['newPassword'].value !=
      this.passwordForm.controls['confirmPassword'].value
    ) {
      this.passwordForm.controls['confirmPassword'].setErrors({
        confirmPasswordExist: true,
      });
      this.confirmPassword = false;
    } else this.confirmPassword = true;
  }

  doCheckPassword(){
    console.log(this.passwordForm.controls['oldPassword'].value.getBase64())
    if(this.passwordForm.controls['oldPassword'].value.getBase64()==this.user.password){
      this.checkPassword=true;
    } else {
      this.checkPassword=false;
      this.passwordForm.controls['oldPassword'].setErrors({
        oldPasswordError: true,
      });
    }
  }

}