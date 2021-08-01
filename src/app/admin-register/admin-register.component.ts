import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeliveryBoys } from 'src/interfaces';
import { ApiService } from '../api.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent implements OnInit {
  user: any;
  method = "post";
  error: any;
  hide = true;
  spinner: any;
  eror: any;
  utype: any; selectedloc: any; loc: any;
  ELEMENT_DATA: DeliveryBoys[] = [];
  displayedColumns: string[] = ['id', 'name', 'phone', 'location', 'upi', 'action'];
  dataSource = new MatTableDataSource<DeliveryBoys>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;


  constructor(private Api: ApiService, private snackBar: MatSnackBar, private dialog: MatDialog,) {
    this.error = { name: null, username: null, gender: null, phone: null, password: null, confpass: null };
    this.user = { name: '', username: '', gender: '', phone: '', password: '', confpass: '' };
  }

  ngOnInit(): void {
    this.getAllAdmin()
    this.utype = localStorage.getItem('utype');

    if (this.utype == 3) {
      this.getlocation()

    }
  }
  getlocation() {
    this.Api.GetAllLocation().subscribe(
      data => {
        this.loc = data;
      },
      error => {
        console.log(error);
      }
    )
  }


  Register(method: any) {
    console.log(this.user)
    if (this.user.name && this.user.username && this.user.gender && (this.user.phone).length>9 && (this.user.phone).length<11  && this.user.location && (this.user.password).length >5 && this.user.confpass) {
      if (this.user.password === this.user.confpass) {
        this.spinner = true;
        this.Api.RegisterApi(this.user).subscribe(
          data => {
            console.log(data)
            if (data.username == this.user.username) {
              this.openSnackBar('Registration Success ✅')
              this.error = { name: null, username: null, gender: null, phone: null, password: null, confpass: null };
              this.user = { name: '', username: '', gender: '', phone: '', password: '', confpass: '', location: '' };
              this.getAllAdmin()
              this.spinner = false;
            }
            else {
              this.error = data;
              this.openSnackBar('Faild ❎')
              this.spinner = false;
            }
          },
          error => {
            console.log("Error " + error)
            this.openSnackBar('Something went wrong ❎')
            this.spinner = false;
          }
        )
      }
      else {
        this.openSnackBar("Password Not Matching")
        this.eror = 1
      }
    }
    else {
      this.eror = 1
      console.log("Missing Data")
    }
  }
  clear() {
    this.user = { name: '', username: '', gender: '', phone: '', password: '', confpass: '' };
    this.method = "post"

  }

  getAllAdmin() {
    this.spinner = true;
    this.Api.GetAlladmin().subscribe(
      data => {
        if (data) {
          console.log(data)
          this.dataSource.data = data as DeliveryBoys[];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner = false;
        }
      },
      error => {
        console.log(error);
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }
  Change(id: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        const data = { id: id };
        this.spinner = true
        this.Api.UpdateUser(data).subscribe(
          data => {
            if (data.msg == "success") {
              console.log(data)
              this.getAllAdmin();
              this.spinner = false
            }
          },
          error => {
            console.log(error)
            this.spinner = false
            this.openSnackBar('Something went wrong ❎')
          }
        )
      }
    });
  }

  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
