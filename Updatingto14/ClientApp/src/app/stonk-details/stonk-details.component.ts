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

  constructor(private watchingService:WatchingService, private stonkService:StonkService, private route:ActivatedRoute, private authService: SocialAuthService) { }
  ngOnInit(): void {
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    this.stonkService.getApiStonks(ticker).subscribe((response:Stonk) => {
      this.displayStonk = response;
      //console.log(response);
    });
  }
  addWatchingStock():any{
    let params = this.route.snapshot.paramMap;
    let ticker:string = String(params.get("ticker"));
    this.watchingService.addWatchingStock(ticker).subscribe((response:any) => {
      //console.log(response);
    });
  }

}
