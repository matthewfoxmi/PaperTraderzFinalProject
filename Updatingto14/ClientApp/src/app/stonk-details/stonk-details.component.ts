import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
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

  constructor(private watchingService:WatchingService, private stonkService:StonkService, private route:ActivatedRoute, private authService: SocialAuthService) { }
  ngOnInit(): void {
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    this.stonkService.getApiStonks(ticker).subscribe((response:Stonk) => {
      this.displayStonk = response;
      //console.log(response);
    });
    this.watchingService.getAllWatchingStocks().subscribe((response:any) => {
      this.addedToWatching = response;
    })
    if(this.addedToWatching.includes(ticker)){
      this.isWatched = true;
    }else{
      this.isWatched = false;
    }
  }
  
  addWatchingStock():any{
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    this.watchingService.addWatchingStock(ticker).subscribe((response:any) => {
      //console.log(response);
    });
  }

  //create a method that goes to DB and searches if a table contains ticker.  on html side call method and do s.ticker
  addOrRemoveWatchingStock():any{

  }
}
