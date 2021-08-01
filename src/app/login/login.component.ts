import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any;
  eror: any;
  spinner: any;
  constructor(private api: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.user = { uaername: '', password: '' };
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('key')) {
      this.router.navigate(['home'])
    }
  }

  Login() {
    this.eror =0;
    if (this.user.username && this.user.password) {
      this.spinner = true;
      this.api.Login(this.user).subscribe(
        data => {
          if (data.msg == "success" && (data.usertype == 0 || data.usertype == 3)) {
            sessionStorage.setItem('key', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('name', data.name + " " + data.last_name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('loc', data.location);
            localStorage.setItem('utype', data.usertype);
            this.spinner = false;
            this.router.navigate(['home']);
          }
          else {
            console.log(data);
            this.eror = data;
            this.spinner = false
            // this.openSnackBar('Something went wrong ❎')
          }
        },
        error => {
          console.log(error);
          this.spinner =false;
          this.openSnackBar('Something went wrong ❎')
        }
      )
    }
    else {
      this.eror = 1;
    }
  }
  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

}
