import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchingService {

  endpoint:string = "api/Watching";
  constructor(@Inject("BASE_URL") private baseUrl:string, private http:HttpClient) { }

  getAllWatchingStocks():any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/ShowWatchingStocks`);
  }

  addWatchingStock(ticker:string, userId:number):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/AddWatchingStock?ticker=${ticker}&userId=${userId}`,{});
  }
  
  removeWatchingStock(ticker:string, userId:number):any{
    return this.http.delete(`${this.baseUrl}${this.endpoint}/RemoveWatchingStock?ticker=${ticker}&userId=${userId}`,{});
  }
  
}
