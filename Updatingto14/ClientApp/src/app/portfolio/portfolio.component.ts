import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, Input, OnInit } from '@angular/core';
import { InvestedStock } from '../invested-stock';
import { InvestedStockService } from '../invested-stock.service';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
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
  allStonks:InvestedStock[] = [];
  constructor(private userService:UserService, private authService: SocialAuthService, private investedStockService:InvestedStockService, private stonkService:StonkService) { }
  // when a user logs in, the loggedin bool gets turned to true.  We can use this to only display portfolio when someone is logged in
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      UserService.user.id = user.id;
      this.loggedIn = (user != null);
    })
    //calls to SQL db and returns the invested stocks as an array
    this.investedStockService.getAllInvested().subscribe((response:InvestedStock[]) => {
      this.allStonks = response;
      //sorts all tickers in array alphabetically
      this.allStonks.sort((a, b) => a.investedTicker.localeCompare(b.investedTicker))
      console.log(response)
      //lines 37-39 grabs the tickers and combines into one string to pass into api for calling those stocks
      let tickers:string = "";
      this.allStonks.forEach((s:any) => {
        tickers += s.investedTicker+",";
        //console.log(tickers)        
      });
      //ticker string from above is used to call api and return the stock data ordered alphabetically by ticker
      this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
        this.stonk = response;
        this.stonk.tickers.sort((a, b) => a.ticker.localeCompare(b.ticker))
        console.log(response)
      });
    });
  }

}
