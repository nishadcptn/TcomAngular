import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderInterface,delivaryReports } from 'src/interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.css'],
  providers: [DatePipe]
})
export class HomeCardComponent implements OnInit {

  datas:any;
  ELEMENT_DATA: OrderInterface[] = [];
  displayedColumns: string[] = ['inv_number','username', 'phone', 'shipper', 'date', 'total_amount', 'status'];
  dataSource = new MatTableDataSource<OrderInterface>(this.ELEMENT_DATA);

  ELEMENT_DATA_: delivaryReports[] = [];
  displayedColumnsSecond: string[] = ['name','total','completed','amount']
  dataSourceSecond = new MatTableDataSource<delivaryReports>(this.ELEMENT_DATA_);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private Api:ApiService, private router:Router, public datePipe: DatePipe,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
    this.GetCont();
    this.getDelivaryReport()
  }

  GetCont(){
    this.Api.DashBoard().subscribe(
      data =>{
        this.datas = data;
        this.dataSource.data = this.datas.order as OrderInterface[];
        this.dataSource.sort = this.sort;

      },
      error =>{
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  getDelivaryReport(){
    this.Api.DelReport().subscribe(
      data =>{
      this.dataSourceSecond.data = data as delivaryReports[];
      },
      error =>{
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  TotalOrders(){
    this.Api.date = null;
    this.Api.status =null;
    this.router.navigate(['home/orders'])
  }

  CompletedOrders(){
    this.Api.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.Api.status = "3";
    this.router.navigate(['home/orders'])
  }
  PendingOrders(){
    this.Api.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.Api.status = "5";
    this.router.navigate(['home/orders'])
  }
  openSnackBar(text:any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition:'end',
      verticalPosition:'bottom'
    });
  }
}
