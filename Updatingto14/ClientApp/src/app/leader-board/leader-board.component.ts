import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { InvestedStock } from '../invested-stock';
import { InvestedStockService } from '../invested-stock.service';
import { NetWorth } from '../net-worth';
import { StonkService } from '../stonk.service';
import { User } from '../user';
import { Stonk } from '../stonk';
import { UserService } from '../user.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  users:User[] = [];
  leaders:NetWorth[] = [];
  rank:number = 0;
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  constructor(private userService:UserService, private authService: SocialAuthService, private investedStockService:InvestedStockService, private stonkService:StonkService) { }

  //brings in user data from SQL database and on C# side they are sorted by total portfolio value
  ngOnInit(): void {

    this.authService.authState.subscribe((user) => {
      this.user = user;
      UserService.user.id = user.id;
      this.loggedIn = (user != null);
    });

    this.userService.getAllUsers().subscribe((response:User[]) => {
      this.users = response;
      this.users.forEach(u => {
        this.getNetWorth(u);
      })
      console.log(this.leaders);
    })
  }

  getNetWorth(user:User):any{
    //calls to SQL db and returns the invested stocks as an array
    let allStonksOwnedByUser:InvestedStock[] = [];
    this.investedStockService.getAllInvestedById(user.googleId).subscribe((response:InvestedStock[]) => {
      response.sort((a, b) => a.investedTicker.localeCompare(b.investedTicker))
      //console.log(response)
      //next 3 lines below grabs the tickers and combines into one string to pass into api for calling those stocks
      let tickers:string = "";
      response.forEach((s:any) => {
        tickers += s.investedTicker+",";
        //console.log(tickers)        
      });
      allStonksOwnedByUser = response;
      //THIS WHOLE CHUNK CALCULATES PORTFOLIO VALUE
      //ticker string from above is used to call api and return the stock data ordered alphabetically by ticker
      let newLeader:NetWorth = {user:user, netWorth:0}; 
      this.stonkService.getApiStonks(tickers).subscribe((response:Stonk) => {
        let index = 0;
        response.tickers.sort((a, b) => a.ticker.localeCompare(b.ticker))
        allStonksOwnedByUser.forEach((s:any) => {
          newLeader.netWorth += (s.sharesOwned * response.tickers[index].day.c);
          //console.log(s.sharesOwned)
          index += 1;
        })
        this.userService.getUserById(user.googleId).subscribe((response:any) => {
          newLeader.netWorth += response.currentCash;
          // console.log(response.currentCash);
          // this.portfolioValue += this.currentCash;
          newLeader.netWorth = Number(newLeader.netWorth.toFixed(2));
          console.log(newLeader);
          this.leaders.push(newLeader);
          this.leaders.sort((a,b) => b.netWorth-a.netWorth)
        });
        //console.log(this.portfolioValue);
        //console.log(response)
      });
    });
  }

}
