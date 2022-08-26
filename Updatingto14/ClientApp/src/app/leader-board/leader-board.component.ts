import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  users:User[] = [];
  rank:number = 0;
  constructor(private userService:UserService) { }

  //brings in user data from SQL database and on C# side they are sorted by total portfolio value
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((response:User[]) => {
      this.users = response;
    })
  }

}
