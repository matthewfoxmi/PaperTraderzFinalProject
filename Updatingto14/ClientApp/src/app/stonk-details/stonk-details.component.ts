import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvestedStock } from '../invested-stock';
import { InvestedStockService } from '../invested-stock.service';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { User } from '../user';
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
  currentCash:number = 0;
  transactionPrice:number = 0;

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
    //moved getSharesOwned inside the ngOnInit, and inside the subscribe for getallwatching stocks
    //ngOnInit also had to be added to the (click) for the html form, as well as the getSharesOwned method
    this.investedStockService.getSharesOwned(this.ticker).subscribe((response:InvestedStock) => {
      console.log(response)
      if(response != null){
        this.sharesOwned = response.sharesOwned;
      }
      else{
        this.sharesOwned = 0;
      }
    })   
    this.userService.getUserById(this.user.id).subscribe((response:User) => {
      this.currentCash = response.currentCash;
    });
  }

  getSharesOwned():void{
    this.investedStockService.getSharesOwned(this.ticker).subscribe((response:InvestedStock) => {
      console.log(response);
      this.sharesOwned = response.sharesOwned;
      console.log(this.sharesOwned);
      this.ngOnInit();
    }); 
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
        this.investedStockService.getSharesOwned(this.ticker).subscribe((response:any) => {
          console.log(response);
          if(response != null){
            this.sharesOwned = response.sharesOwned;
          }
          else{
            this.sharesOwned = 0;
          }
          console.log(this.sharesOwned);
          //togglePurchaseForm moved inside subscribe - fixed sharesOwned updating
          this.userService.getUserById(this.user.id).subscribe((response:User) => {
            this.currentCash = response.currentCash;
          });
          this.togglePurchaseForm();
        });
      });
      //added getSharesOwned to purchaseStock to update after every purchase
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
        this.investedStockService.getSharesOwned(this.ticker).subscribe((response:any) => {
          console.log(response);
          if(response != null){
            this.sharesOwned = response.sharesOwned;
          }else{
            this.sharesOwned = 0;
          }
          console.log(this.sharesOwned);
          this.userService.getUserById(this.user.id).subscribe((response:User) => {
            this.currentCash = response.currentCash;
          });
        });
      });
    });
    //added SharesOwned to sellStock to update after every purchase
  }

  togglePurchaseForm():void{
    this.displayPurchaseForm = !this.displayPurchaseForm;
    this.transactionPrice = 0;
  }

  toggleSellForm():void{
    this.displaySellForm = !this.displaySellForm;
    this.transactionPrice = 0;
  }

  numberWithCommas(x:number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  difference(a:number) {
    return Math.abs(a);
  }
  
  calculatePrice(form:NgForm){
    this.transactionPrice = (this.displayStonk.tickers[0].day.c * form.form.value.quantity)
    return this.transactionPrice;
  }

  purchaseMax(){
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    let currentPrice:number;
    this.stonkService.getApiStonks(ticker).subscribe((response: Stonk) => {
      currentPrice = response.tickers[0].day.c;
      //console.log(currentPrice);
      this.investedStockService.purchaseStock(ticker, currentPrice, Math.floor(this.currentCash / this.displayStonk.tickers[0].day.c)).subscribe((response:InvestedStock) => {
        //console.log(response);
        this.investedStockService.getSharesOwned(this.ticker).subscribe((response:any) => {
          console.log(response);
          if(response != null){
            this.sharesOwned = response.sharesOwned;
          }
          else{
            this.sharesOwned = 0;
          }
      });
      //added getSharesOwned to purchaseStock to update after every purchase
        console.log(this.sharesOwned);
        //togglePurchaseForm moved inside subscribe - fixed sharesOwned updating
        this.userService.getUserById(this.user.id).subscribe((response:User) => {
          this.currentCash = response.currentCash;
        });
        this.togglePurchaseForm();
      });
    });
  }

  sellMax(){
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    let currentPrice:number;
    //calls to the api and obtains current price 
    this.stonkService.getApiStonks(ticker).subscribe((response: Stonk) => {
      currentPrice = response.tickers[0].day.c;
      console.log(currentPrice);
      //passes in the ticker, current price (obtained above) and quantity of stocks to sell from form
      this.investedStockService.sellStock(ticker, currentPrice, this.sharesOwned).subscribe((response:InvestedStock) => {
        console.log(response);
        this.toggleSellForm();
        this.investedStockService.getSharesOwned(this.ticker).subscribe((response:any) => {
          console.log(response);
          if(response != null){
            this.sharesOwned = response.sharesOwned;
          }else{
            this.sharesOwned = 0;
          }
          this.userService.getUserById(this.user.id).subscribe((response:User) => {
            this.currentCash = response.currentCash;
          });
          console.log(this.sharesOwned);
        });
      });
    });
  }

  roundDown(x:number):number{
    return Math.floor(x);
  }


}
