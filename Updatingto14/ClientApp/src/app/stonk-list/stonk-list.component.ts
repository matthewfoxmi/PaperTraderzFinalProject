import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { UserService } from '../user.service';
import { WatchingService } from '../watching.service';

@Component({
  selector: 'app-stonk-list',
  templateUrl: './stonk-list.component.html',
  styleUrls: ['./stonk-list.component.css']
})
export class StonkListComponent implements OnInit {

  stonk:Stonk = {} as Stonk;
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  addedToWatching:string[] = [];

  constructor(private authService: SocialAuthService, private userService:UserService, private stonkService:StonkService, private watchingService:WatchingService, private router:Router) { }

  //accesses our SQL database, adds all tickers into singular string to be passed into the api and returns matching stock data
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      UserService.user.id = user.id;
      this.loggedIn = (user != null);
    });

    this.stonkService.getAllStonks().subscribe((response:any) => {
      let allStonks = response;
      let tickers:string = "";
      allStonks.forEach((s:any) => {
        tickers += s.ticker+",";
      });
      this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
        this.stonk = response;
        this.stonk.tickers.sort((a, b) => a.ticker.localeCompare(b.ticker))
      });
    });
  }

  getWatching(ticker:string):boolean {
    if(this.addedToWatching.includes(ticker)){
      return true;
    }else{
      return false;
    }
  }
  
//Function to add a stock to our DB.  takes ticker from URL and passes it back to C# side
  addWatchingStock(ticker:string):any{
    this.watchingService.addWatchingStock(ticker).subscribe((response:any) => {
      //console.log(response);
      this.addedToWatching.push(ticker);
    });
  }
//Removes a stock from DB.  Takes ticker from URL again, and sends back the ticker.  UserID is also sent back to C# side from service
  removeWatchingStock(ticker:string):any{
    this.watchingService.removeWatchingStock(ticker).subscribe((response:any) => {
      //console.log(response);
      let index = this.addedToWatching.findIndex(x => x == ticker);
      this.addedToWatching.splice(index,1);
  });
}  

  searchForStock(form:NgForm):any{
    let search = form.form.value.searchedStock;
    this.router.navigate([`StonkDetails/${search.toUpperCase()}`])
  }
  
  numberWithCommas(x:number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
}
