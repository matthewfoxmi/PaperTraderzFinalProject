import { Component, OnInit } from '@angular/core';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { WatchingService } from '../watching.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  isEmpty:boolean = false;
  stonk:Stonk = {} as Stonk;
  constructor(private stonkService: StonkService, private watchingService: WatchingService) { }

  //accesses SQL database table for all watched stocks and pulls from api
  ngOnInit(): void {
    this.watchingService.getAllWatchingStocks().subscribe((response:any[]) => {
      let allStonks = response;
      console.log(response);
      if(response.length >= 1){
        let tickers:string = "";
      allStonks.forEach((s:any) => {
        tickers += s+",";
        console.log(s);
      });
      console.log(tickers)
      this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
        console.log(response);
        this.stonk = response;
        this.isEmpty = true;
      });
      }else{
        this.isEmpty = false;
      }

    })
  }

  
}
