import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InvestedStockService {

  
  endpoint:string = "api/InvestedStocks";

  constructor(private http:HttpClient, @Inject("BASE_URL") private baseUrl:string ) { }

  purchaseStock(ticker:string, purchasePrice:number, sharesPurchased: number):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/PurchaseStock?ticker=${ticker}&purchasePrice=${purchasePrice}&sharesPurchased=${sharesPurchased}&googleId=${UserService.user.id}`,{});
  }

  sellStock(ticker:string, sellPrice:number, sharesSold: number):any{
    return this.http.patch(`${this.baseUrl}${this.endpoint}/SellStock?ticker=${ticker}&sellPrice=${sellPrice}&sharesSold=${sharesSold}&googleId=${UserService.user.id}`, {});
  }


}
