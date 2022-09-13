import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { User } from 'oidc-client';
import { InvestedStock } from '../invested-stock';
import { InvestedStockService } from '../invested-stock.service';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { WatchingService } from '../watching.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  stonk:Stonk = {} as Stonk;
  allStonksOwnedByUser:InvestedStock[] = [];
  portfolioValue:number = 0;
  currentCash:number = 0;
  isEmpty:boolean = false;
  editModeUserName:boolean = false;
  editModeProfilePicture:boolean = false;
  profileName:string = "";
  userNameExists: boolean = false;
  profilePicture:string = "";

  constructor(private userService:UserService, private authService: SocialAuthService, private investedStockService:InvestedStockService, private stonkService:StonkService) { }
  // when a user logs in, the loggedin bool gets turned to true.  We can use this to only display portfolio when someone is logged in
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      UserService.user.id = user.id;
      this.loggedIn = (user != null);
      //calls to SQL db and returns the invested stocks as an array
      this.investedStockService.getAllInvested().subscribe((response:InvestedStock[]) => {
        this.allStonksOwnedByUser = response;
        //sorts all tickers in array alphabetically
        this.allStonksOwnedByUser.sort((a, b) => a.investedTicker.localeCompare(b.investedTicker))
        //console.log(response)
        //3 lines below grabs the tickers and combines into one string to pass into api for calling those stocks
        let tickers:string = "";
        this.allStonksOwnedByUser.forEach((s:any) => {
          tickers += s.investedTicker+",";
          //console.log(tickers)        
        });
        //THIS WHOLE CHUNK CALCULATES PORTFOLIO VALUE
        //ticker string from above is used to call api and return the stock data ordered alphabetically by ticker
        this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
          this.stonk = response;
          if(response.count < 1000){
            let index = 0;
            this.stonk.tickers.sort((a, b) => a.ticker.localeCompare(b.ticker))
            this.allStonksOwnedByUser.forEach((s:any) => {
              this.portfolioValue += (s.sharesOwned * this.stonk.tickers[index].day.c);
              index += 1;
            })
            this.userService.getUserById(this.user.id).subscribe((response:any) => {
              this.currentCash = response.currentCash;
              this.profileName = response.profileName;
              this.profilePicture = response.userIcon;
              console.log(response.currentCash);
              this.portfolioValue += this.currentCash;
              this.portfolioValue = Number(this.portfolioValue.toFixed(2));
            });
            console.log(this.portfolioValue);
            //console.log(response)
            this.isEmpty = true;
          }else{
            this.isEmpty = false;
            this.userService.getUserById(this.user.id).subscribe((response:any) => {
              this.profileName = response.profileName;
              this.profilePicture = response.userIcon;
              this.currentCash = response.currentCash;
              console.log(response);
              this.portfolioValue += this.currentCash;
              this.portfolioValue = Number(this.portfolioValue.toFixed(2));
            });
          }
        });
      });
    })
  }
  toggleEditUserName():void{
    this.editModeUserName = !this.editModeUserName;
  }
  toggleEditProfilePicture():void{
    this.editModeProfilePicture = !this.editModeProfilePicture;
  }
  saveChanges(form:NgForm):void{
    // let profileName = form.form.value.profileName;
    this.userService.editProfile(form.form.value.profileName).subscribe((response:User) => {
      if(response == null){
        this.userNameExists = true;
      }
      else{
        this.userNameExists = false;
        this.profileName = response.profileName;
      }
      console.log(response);
    })
  }
  saveNewProfilePic(form:NgForm):void{
    this.userService.editProfilePicture(form.form.value.profilePicture).subscribe((response:User) => {
      this.profilePicture = response.userIcon;
      console.log(response);
    })
  }
  numberWithCommas(x:number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
