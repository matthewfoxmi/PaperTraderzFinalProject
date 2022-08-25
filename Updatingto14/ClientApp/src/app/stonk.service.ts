import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Secret } from './secret';
import { Stonk } from './stonk';

@Injectable({
  providedIn: 'root'
})
export class StonkService {

  apiUrl:string = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?`;
  endpoint:string = "api/Stonk";
  // stonks:Stonk = {} as Stonk;
  // allStonks:string[] = [];

  constructor(private http:HttpClient, @Inject("BASE_URL") private baseUrl:string ) { }

  getApiStonks(tickers: string):any {
   return this.http.get(`${this.apiUrl}tickers=${tickers}&apiKey=${Secret.apiKey}`);
  }

  //calls the SQL database to generate the list of all stocks
  getAllStonks():any {
    // this.allStonks = [];
    // this.stonks = {} as Stonk;
   return this.http.get(`${this.baseUrl}${this.endpoint}/getAllStonks`);
  //  .subscribe((response:any) => {
  //   this.allStonks = response;
  //   // console.log(response);
  //   let tickers:string = "";
  // this.allStonks.forEach((s:any) => {
  //     tickers += s.ticker+",";
  //   });
  //   console.log(tickers);
  //   this.http.get(`${this.apiUrl}tickers=${tickers}&apiKey=${Secret.apiKey}`).subscribe((response:any) => {
  //     this.stonks = response;
  //     console.log(response);
  //   });
  // });

}

}
