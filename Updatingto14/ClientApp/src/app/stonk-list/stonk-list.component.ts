import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';
import { WatchingService } from '../watching.service';

@Component({
  selector: 'app-stonk-list',
  templateUrl: './stonk-list.component.html',
  styleUrls: ['./stonk-list.component.css']
})
export class StonkListComponent implements OnInit {

  stonksList:Stonk = {} as Stonk;
  constructor(private stonkService:StonkService, private watchingService:WatchingService, private router:Router) { }

  //accesses our SQL database, adds all tickers into singular string to be passed into the api and returns matching stock data
  ngOnInit(): void {
    this.stonkService.getAllStonks().subscribe((response:any) => {
      let allStonks = response;
      let tickers:string = "";
      allStonks.forEach((s:any) => {
        tickers += s.ticker+",";
      });
      this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
        this.stonksList = response;
        this.stonksList.tickers.sort((a, b) => a.ticker.localeCompare(b.ticker))
      });
    });
  }

  searchForStock(form:NgForm):any{
    let search = form.form.value.searchedStock;
    this.router.navigate([`StonkDetails/${search}`])
  }  

}
