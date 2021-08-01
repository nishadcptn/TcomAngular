import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  superuser:any;
  constructor() { }

  ngOnInit(): void {
   this.superuser =  localStorage.getItem('utype');
  }

}
