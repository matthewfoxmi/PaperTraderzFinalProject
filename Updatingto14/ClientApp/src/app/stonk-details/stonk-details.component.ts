import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvestedStock } from '../invested-stock';
import { InvestedStockService } from '../invested-stock.service';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { UserService } from '../user.service';
import { WatchingService } from '../watching.service';

@Component({
  selector: 'app-stonk-details',
  templateUrl: './stonk-details.component.html',
  styleUrls: ['./stonk-details.component.css']
})
export class StonkDetailsComponent implements OnInit {

  displayStonk: Stonk = {} as Stonk;
  isWatched:boolean = false;
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  addedToWatching:string[] = [];
  ticker:string = "";
  displayPurchaseForm:boolean = false;
  displaySellForm:boolean = false;
  sharesOwned:number = 0;

  constructor(private userService:UserService, private investedStockService:InvestedStockService, private watchingService:WatchingService, private stonkService:StonkService, private route:ActivatedRoute, private authService: SocialAuthService) { }
  //grabs ticker from URL, sends ticker to stock API to pull relevant data
  ngOnInit(): void {

    this.authService.authState.subscribe((user) => {
      this.user = user;
      UserService.user.id = user.id;
      this.loggedIn = (user != null);
    });
    let params = this.route.snapshot.paramMap;
    this.ticker = String(params.get("ticker"));
    this.stonkService.getApiStonks(this.ticker).subscribe((response:Stonk) => {
      this.displayStonk = response;
      //console.log(response);
    });
    this.watchingService.getAllWatchingStocks().subscribe((response:any) => {
      this.addedToWatching = response;
      //console.log(response);      
    }) 
    this.investedStockService.getSharesOwned(this.ticker).subscribe((response:InvestedStock) => {
      console.log(response)
      this.sharesOwned = response.sharesOwned
    })   

  }
  //checks if the addedtowatching array contains the ticker, if so return true
  //results in only the remove from watchlist button showing if true
  getWatching():boolean {
    if(this.addedToWatching.includes(this.ticker)){
      return true;
    }else{
      return false;
    }
  }
//Function to add a stock to our DB.  takes ticker from URL and passes it back to C# side
  addWatchingStock():any{
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    this.watchingService.addWatchingStock(ticker).subscribe((response:any) => {
      //console.log(response);
      this.addedToWatching.push(this.ticker);
    });
  }
//Removes a stock from DB.  Takes ticker from URL again, and sends back the ticker.  UserID is also sent back to C# side from service
  removeWatchingStock():any{
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    this.watchingService.removeWatchingStock(ticker).subscribe((response:any) => {
      //console.log(response);
      let index = this.addedToWatching.findIndex(x => x == this.ticker);
      this.addedToWatching.splice(index,1);
  });
}  
  
  purchaseStock(form:NgForm):any{    
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    let currentPrice:number;
    this.stonkService.getApiStonks(ticker).subscribe((response: Stonk) => {
      currentPrice = response.tickers[0].day.c;
      //console.log(currentPrice);
      this.investedStockService.purchaseStock(ticker, currentPrice, form.form.value.quantity).subscribe((response:InvestedStock) => {
        //console.log(response);
        this.togglePurchaseForm();
      });
    });
    
  }

  sellStock(form:NgForm):any{
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    let currentPrice:number;
    //calls to the api and obtains current price 
    this.stonkService.getApiStonks(ticker).subscribe((response: Stonk) => {
      currentPrice = response.tickers[0].day.c;
      console.log(currentPrice);
      //passes in the ticker, current price (obtained above) and quantity of stocks to sell from form
      this.investedStockService.sellStock(ticker, currentPrice, form.form.value.quantity).subscribe((response:InvestedStock) => {
        console.log(response);
        this.toggleSellForm();
      });
    });
    
  }

  togglePurchaseForm():void{
    this.displayPurchaseForm = !this.displayPurchaseForm;
  }

  toggleSellForm():void{
    this.displaySellForm = !this.displaySellForm;
  }

  numberWithCommas(x:number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  difference(a:number) {
    return Math.abs(a);
  }
  



}
