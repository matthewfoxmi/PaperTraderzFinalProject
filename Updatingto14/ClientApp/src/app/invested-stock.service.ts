import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InvestedStockService {

  
  endpoint:string = "api/InvestedStocks";

  constructor(private http:HttpClient, @Inject("BASE_URL") private baseUrl:string ) { }

  purchaseStock(ticker:string, purchasePrice:number, sharesOwned: number):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/PurchaseStock?ticker=${ticker}&purchasePrice=${purchasePrice}&sharesOwned=${sharesOwned}&googleId=${UserService.user.id}`,{});
  }


}
