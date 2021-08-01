import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderDetailsInterface } from 'src/interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  data:any;
  date:any;
  status:any;
  spinner:any;
  orderData:any
  ELEMENT_DATA: OrderDetailsInterface[] = [];
  displayedColumns: string[] = ['id', 'name','unit', 'quantity', 'price','discount', 'amount'];
  dataSource = new MatTableDataSource<OrderDetailsInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private Api:ApiService, private router:Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
    this.data = this.Api.data;
    this.date = this.Api.date;
    this.status = this.Api.status;

    if(this.data){
      this.getOrder(this.data)
      this.getOrderDetails(this.data);
    }
    else{
      this.router.navigate(['home/orders'])
    }
  }
  getOrder(id:any){
    this.spinner =true;
    this.Api.getSpecficOrder(id).subscribe(
      data =>{
        this.orderData = data;
        console.log(data)
      },
      error =>{
        console.log(error);
        this.spinner =false;
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }
  getOrderDetails(id:any){
    this.spinner =true;
    this.Api.OrderDetailsApi(id).subscribe(
      data =>{
        this.dataSource.data = data as OrderDetailsInterface[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner =false;
      },
      error =>{
        console.log(error);
        this.spinner =false;
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  back(){
    this.Api.date = this.date;
    this.Api.status = this.status;
    this.router.navigate(['home/orders'])
  }
  getTotal() {
    return this.dataSource.data.map(t => t.amount).reduce((acc:any, value:any) => acc + value, 0);
  }
  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
