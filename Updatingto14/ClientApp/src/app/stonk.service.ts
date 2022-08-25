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
  stonks:Stonk[] = [];
  allStonks:string[] = [];

  constructor(private http:HttpClient, @Inject("BASE_URL") private baseUrl:string ) { }

  //calls the SQL database to generate the list of all stocks
  getAllStonks():any {
  this.http.get(`${this.baseUrl}${this.endpoint}/getAllStonks`).subscribe((response:any) => {
    this.allStonks = response;
  this.allStonks.forEach((s:string) => {
      this.http.get(`${this.apiUrl}tickers=${s}&apiKey=${Secret.apiKey}`).subscribe((response:any) => {
        this.stonks.push(response);
      });
  });
  });

}

}
