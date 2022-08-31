import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //gives us access to the logged in google ID.  Can pass back to SQL to get the user info
  static user:SocialUser;
  endpoint:string = "api/User";
  constructor(@Inject("BASE_URL") private baseUrl:string, private http:HttpClient) { }

  getAllUsers():any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/getAllUsers`);
  }

  getUserById(id:string):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/getUserByGoogleId/${id}`);
  }

  createNewUser(id:string):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/createNewUser?googleId=${id}&profileName=${UserService.user.firstName}_${UserService.user.lastName}`, {})
  }
}
