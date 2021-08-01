import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeliveryBoys } from 'src/interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-delivery-boys-registration',
  templateUrl: './delivery-boys-registration.component.html',
  styleUrls: ['./delivery-boys-registration.component.css']
})
export class DeliveryBoysRegistrationComponent implements OnInit {
  user:any;
  method ="post";
  error:any;
  hide = true;
  spinner:any;
  eror:any;
  utype: any; selectedloc: any; loc: any;
  ELEMENT_DATA: DeliveryBoys[] = [];
  displayedColumns: string[] = ['id', 'name','phone', 'status'];
  dataSource = new MatTableDataSource<DeliveryBoys>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;


  constructor(private Api:ApiService, private snackBar: MatSnackBar) {
    this.error={name: null, username: null, gender: null, phone: null, password: null,confpass:null };
    this.user = { name: '', username: '', gender: '', phone: '', password: '',confpass:'' };
   }

  ngOnInit(): void {
    this.getDeliveryBoys()

    this.utype = localStorage.getItem('utype');

    if (this.utype == 3) {
      this.getlocation()
      this.selectedloc = Number(localStorage.getItem('loc'));
    }
  }

  getlocation() {
    this.Api.GetAllLocation().subscribe(
      data => {
        this.loc = data;
      },
      error => {
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }
  OnLOcationChange(){
    localStorage.setItem('loc',this.selectedloc)
    this.getDeliveryBoys();
  }

  Register(method:any){
    console.log(this.user)
    if(this.user.name && this.user.username && this.user.gender && (this.user.phone).length>9 && (this.user.phone).length<11  && (this.user.password).length >=6 && this.user.confpass){
      if(this.user.password === this.user.confpass){
        this.spinner = true;
        this.Api.RegisterApi(this.user).subscribe(
          data =>{
            console.log(data)
            if(data.username ==this.user.username){
              this.openSnackBar('Registration Success ✅')
              this.error={name: null, username: null, gender: null, phone: null, password: null,confpass:null };
              this.user = { name: '', username: '', gender: '', phone: '', password: '',confpass:'' };
              this.getDeliveryBoys()
              this.spinner=false;
            }
            else{
              this.error = data;
              this.openSnackBar('Faild ❎')
              this.spinner =false;
            }
          },
          error =>{
            console.log("Error "+error)
            this.spinner = false;
            this.openSnackBar('Something went wrong ❎')
          }
        )
      }
      else{
        this.openSnackBar("Password Not Matching")
        this.eror = 1
      }
    }
    else{
      this.eror = 1
      console.log("Missing Data")
    }
  }
  clear(){
    this.user = { name: '', username: '', gender: '', phone: '', password: '',confpass:'' };
    this.method ="post"

  }

  getDeliveryBoys() {
    this.spinner = true;
    this.Api.GetDelivaryBoy(false).subscribe(
      data => {
        if (data) {
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
  Change(id:any,status:any){
    console.log(id,status)
    const data = {id:id,status:status};
    this.spinner = true
    this.Api.DeliveryBoysStatusUpdate(data).subscribe(
      data =>{
        if(data.msg=="success"){
          console.log(data)
          this.getDeliveryBoys();
          this.spinner = false
        }
      },
      error =>{
        console.log(error)
        this.spinner = false
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  openSnackBar(text:any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition:'end',
      verticalPosition:'bottom'
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
