import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NoSpace } from '../_helpers/validator';
import { EMAIL_REGEX } from '../_helpers/validator';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { OauthService } from '../_service/oauth-service/oauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  isVisible: boolean = false;
  isLoadingSend: boolean = false;
  modalForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  isLoading: boolean = false;
  socialUser!:SocialUser;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private tokenStorage: TokenStorageService,
    private auth: AuthenticationService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private oauthService:OauthService,
    //private websocket:WebsocketService,
  ) {}
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.validateForm = this.fb.group({
      username: ['', [Validators.required, NoSpace]],
      password: ['', [Validators.required, NoSpace]],
    });
    this.modalForm = this.fb.group({
      mail: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    });

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedIn = user != null;
    });
    //this.websocket._connect();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.auth.login(this.validateForm.value).subscribe(
        (data:any) => {
          if(data.success){
            this.isLoading = false;
            this.tokenStorage.saveToken(data.data.jwt);
            this.tokenStorage.saveUser(data.data.user);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            if(data.data.user.is_profile){
              this.router.navigate(['/home']);
            } else this.router.navigate(['/create-profile']);
          } else{
            this.isLoginFailed = true;
            this.isLoading = false;
            this.msg.error('Incorrect username or password')
          }
          
        }
      );
    }
  }
  reloadPage(): void {
    window.location.reload();
  }

  openModal() {
    this.isVisible = true;
    this.modalForm.reset();

  }
  handleCancel() {
    this.modalForm.reset();
    this.isVisible = false;
  }
  handleOk() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      this.isLoadingSend = true;
      this.auth
        .sendEmailForgotPassword(this.modalForm.controls['mail'].value)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoadingSend = false;
            this.msg.success(
              'Send email forgot password successfully. Please access your email to check password!'
            );
            this.handleCancel();
            this.router.navigate(['/login']);
          } else {
            this.isLoadingSend = false;
            this.msg.error(res.message);
            this.handleCancel();
          }
        });
    }
  }

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (data) => {
        this.socialUser = data;
        const tokenFacebook = this.socialUser.authToken;
        this.oauthService.facebook(tokenFacebook).subscribe(
          res => {
            this.tokenStorage.saveToken(res.data.jwt);
          this.tokenStorage.saveUser(res.data.user);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          if(res.data.user.is_profile){
            this.router.navigate(['/home']);
          } else this.router.navigate(['/create-profile']);
          
          },
          err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
            this.isLoading = false;
            this.msg.error('Login with facebook false!')
          }
        );
      }
    );
  }
  loginWithGoogle() {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
        (data) => {
          this.socialUser = data;
          const tokenGoogle = this.socialUser.idToken;
          this.oauthService.google(tokenGoogle).subscribe(
            res => {
              this.tokenStorage.saveToken(res.data.jwt);
            this.tokenStorage.saveUser(res.data.user);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            if(res.data.user.is_profile){
              this.router.navigate(['/home']);
            } else this.router.navigate(['/create-profile']);
          },
          err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
            this.isLoading = false;
            this.msg.error('Login with google false!')
          }
        );
      }
    );
  }
  signOut(): void {
    this.socialAuthService.signOut();
  }
}
