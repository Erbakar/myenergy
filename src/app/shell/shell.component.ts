import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  project: string = environment.project;
  ngOnInit() {
    console.log(this.project);
  }
}
