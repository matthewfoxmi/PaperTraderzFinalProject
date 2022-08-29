import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WatchingService {


  endpoint:string = "api/Watching";
  constructor(@Inject("BASE_URL") private baseUrl:string, private http:HttpClient) { }

  getAllWatchingStocks():any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/ShowWatchingStocks?googleId=${UserService.user.id}`);
  }

  addWatchingStock(ticker:string):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/AddWatchingStock?ticker=${ticker}&googleId=${UserService.user.id}`,{});
  }
  
  removeWatchingStock(ticker:string):any{
    return this.http.delete(`${this.baseUrl}${this.endpoint}/RemoveWatchingStock?ticker=${ticker}&googleId=${UserService.user.id}`,{});
  }
  
}
