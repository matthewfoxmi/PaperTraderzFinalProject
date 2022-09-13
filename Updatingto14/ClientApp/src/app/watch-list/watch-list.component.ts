import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { UserService } from '../user.service';
import { WatchingService } from '../watching.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  isEmpty:boolean = false;
  stonk:Stonk = {} as Stonk;
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  addedToWatching:string[] = [];

  constructor(private stonkService: StonkService, private watchingService: WatchingService, private userService:UserService, private authService: SocialAuthService) { }

  //accesses SQL database table for all watched stocks and pulls from api
  ngOnInit(): void {
    //used to hide components if user is not logged in
    this.authService.authState.subscribe((user) => {
      this.user = user;
      UserService.user.id = user.id;
      this.loggedIn = (user != null);
    });
    this.watchingService.getAllWatchingStocks().subscribe((response:any[]) => {
      let allStonks = response;
      console.log(response);
      //if statement makes sure we aren't returning null - if we return null we'll get the entire stockmarket data
      if(response.length >= 1){
        let tickers:string = "";
        //separates result from our SQL table with a comma.  Saves to the tickers string which is sent thru stock API to get data
      allStonks.forEach((s:any) => {
        tickers += s+",";
        console.log(s);
      });
      console.log(tickers)
      //ticker passing to API
      this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
        console.log(response);
        this.stonk = response;
        this.stonk.tickers.sort((a, b) => a.ticker.localeCompare(b.ticker))
        this.isEmpty = true;
      });
      }else{
        this.isEmpty = false;
      }
    });
  }
  removeWatchingStock(ticker:string):any{
    this.watchingService.removeWatchingStock(ticker).subscribe((response:any) => {
      let index = this.addedToWatching.findIndex(x => x == ticker);
      this.addedToWatching.splice(index,1); 
      let index2:number = this.stonk.tickers.findIndex(t => t.ticker == ticker)
      this.stonk.tickers.splice(index2,1);
      if(this.stonk.tickers.length == 0)
      {
        this.isEmpty = false;
      }
  });   
 }

 numberWithCommas(x:number) {
  return x.toFixed(2)
  // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

}
