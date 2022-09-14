import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestedStock } from '../invested-stock';
import { InvestedStockService } from '../invested-stock.service';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {

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

  constructor(private investedStockService:InvestedStockService, private stonkService:StonkService, private userService:UserService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    let params = this.route.snapshot.paramMap;
    let googleId:string = String(params.get("googleId"));
      this.investedStockService.getAllInvestedById(googleId).subscribe((response:InvestedStock[]) => {
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
            this.userService.getUserById(googleId).subscribe((response:any) => {
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
            this.userService.getUserById(googleId).subscribe((response:any) => {
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
    }

  numberWithCommas(x:number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
