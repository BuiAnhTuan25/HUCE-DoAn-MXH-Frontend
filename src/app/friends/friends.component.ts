import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
friends:any[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  constructor() { }

  ngOnInit(): void {
  }

}
