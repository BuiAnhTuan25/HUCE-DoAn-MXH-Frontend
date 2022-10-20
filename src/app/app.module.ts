import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';

import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PersonalInfomationComponent } from './personal-infomation/personal-infomation.component';
import { ListFriendsComponent } from './list-friends/list-friends.component';
import { PostsComponent } from './posts/posts.component';
import { ListChatComponent } from './list-chat/list-chat.component';
import { ListUserGroupComponent } from './list-user-group/list-user-group.component';
import { ChatContentComponent } from './chat-content/chat-content.component';
import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { FriendsComponent } from './friends/friends.component';
import { RegisterVerifyComponent } from './register-verify/register-verify.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CreateProfileComponent,
    ProfileComponent,
    ChatComponent,
    PageNotFoundComponent,
    PersonalInfomationComponent,
    ListFriendsComponent,
    PostsComponent,
    ListChatComponent,
    ListUserGroupComponent,
    ChatContentComponent,
    HomeComponent,
    CreatePostComponent,
    NewsFeedComponent,
    FriendsComponent,
    RegisterVerifyComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    SocialLoginModule,
    InfiniteScrollModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }, 
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('744716950059120'),
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('716469277461-al1ds3lmgi6r7s9lm5ggs2idaqfpjp6r.apps.googleusercontent.com',
          {
            scope:'email',
            plugin_name:'google'
           })
        },
      ],
    } as SocialAuthServiceConfig,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
