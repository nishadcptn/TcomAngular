import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  location:any;
  select:any;
  usertype:any
  constructor(private api:ApiService, private router:Router) {
    this.usertype = localStorage.getItem('utype')
   }

  name = localStorage.getItem('name')
  username = localStorage.getItem('username')
  email = localStorage.getItem('email')
  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
  }

  Logout(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate([''])
  }
}
