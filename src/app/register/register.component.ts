import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EMAIL_REGEX, NoSpace } from '../_helpers/validator';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { OauthService } from '../_service/oauth-service/oauth.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  validateForm!: FormGroup;
  isLoading: boolean = false;
  isVisible: boolean = false;
  isLoadingSend: boolean = false;
  modalForm!: FormGroup;
  socialUser!:SocialUser;
  errorMessage = '';
  roles: string[] = [];
  isLoggedIn = false;
  isLoginFailed = false;
  constructor(
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private msg: NzMessageService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private oauthService:OauthService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.pattern(EMAIL_REGEX), NoSpace],
      ],
      username: ['', [Validators.required, NoSpace]],
      password: ['', [Validators.required, NoSpace]],
    });

    this.modalForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    });
    
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedIn = user != null;
    });
  }

  register() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.auth.register(this.validateForm.value).subscribe((res: any) => {
        if (res.success) {
          this.isLoading = false;
          this.msg.success('Register successfully,please confirm in your email!');
          this.router.navigate(['/login']);
        } else {
          this.msg.error(res.message);
          this.isLoading=false;
        }
      });
    }
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
            if(res.data.user.is_profile){
              this.router.navigate(['/profile']);
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
          this.router.navigate(['/profile']);
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
openModal() {
  this.isVisible = true;
  this.isLoadingSend=false;
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
      .sendEmailForgotPassword(this.modalForm.controls['email'].value)
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

}
