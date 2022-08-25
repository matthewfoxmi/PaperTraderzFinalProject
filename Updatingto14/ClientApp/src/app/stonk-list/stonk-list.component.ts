import { Component, OnInit } from '@angular/core';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';

@Component({
  selector: 'app-stonk-list',
  templateUrl: './stonk-list.component.html',
  styleUrls: ['./stonk-list.component.css']
})
export class StonkListComponent implements OnInit {

  stonksList:Stonk = {} as Stonk;
  constructor(private stonkService:StonkService) { }

  ngOnInit(): void {
    this.stonkService.getAllStonks().subscribe((response:any) => {
      let allStonks = response;
      let tickers:string = "";
      allStonks.forEach((s:any) => {
        tickers += s.ticker+",";
      });
      this.stonkService.getApiStonks(tickers).subscribe((response:any) => {
        this.stonksList = response;
      });
    });
  }

}
