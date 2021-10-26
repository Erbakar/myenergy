import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  activeUser = {
    id: '',
    email: '',
  };
  constructor() {}

  ngOnInit() {}
  public selectedUser(item: any): void {
    this.activeUser = item;
  }
}
