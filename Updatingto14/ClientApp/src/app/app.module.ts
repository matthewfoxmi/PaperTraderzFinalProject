import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { Secret } from './secret';
import { StonkListComponent } from './stonk-list/stonk-list.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { StonkDetailsComponent } from './stonk-details/stonk-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    StonkListComponent,
    WatchListComponent,
    LeaderBoardComponent,
    PortfolioComponent,
    StonkDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    RouterModule.forRoot([
      { path: '', component: PortfolioComponent, pathMatch: 'full' },
      { path: 'Stonks', component: StonkListComponent },
      { path: 'WatchList', component: WatchListComponent },
      { path: 'Leaderboard', component: LeaderBoardComponent },
      { path: 'StonkDetails/:ticker', component: StonkDetailsComponent }
    ])
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              Secret.secret
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
