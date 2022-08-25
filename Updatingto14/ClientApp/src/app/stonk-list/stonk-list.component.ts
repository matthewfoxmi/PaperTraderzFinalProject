import { Component, OnInit } from '@angular/core';
import { Stonk } from '../stonk';
import { StonkService } from '../stonk.service';

@Component({
  selector: 'app-stonk-list',
  templateUrl: './stonk-list.component.html',
  styleUrls: ['./stonk-list.component.css']
})
export class StonkListComponent implements OnInit {

  stonksList:Stonk[] = [];
  constructor(private stonkService:StonkService) { }

  ngOnInit(): void {
    this.stonkService.getAllStonks();
    this.stonksList = this.stonkService.stonks;   
    console.log(this.stonkService.stonks); 
  }

}
