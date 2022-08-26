import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endpoint:string = "api/User";
  constructor(@Inject("BASE_URL") private baseUrl:string, private http:HttpClient) { }

  getAllUsers():any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/getAllUsers`);
  }

  getUserById(id:string):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/getUserByGoogleId/${id}`);
  }
}
