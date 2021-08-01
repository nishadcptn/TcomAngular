import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlldelivaryReports } from 'src/interfaces';
import { ApiService } from '../api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-delivery-report',
  templateUrl: './delivery-report.component.html',
  styleUrls: ['../app.component.css'],
  providers: [DatePipe]
})
export class DeliveryReportComponent implements OnInit {


  spinner: any;
  error: any;
  date = new Date();
  start: any;
  end: any;
  filename = "DeliveryReport" + this.date + ".xlsx"
  utype: any; selectedloc: any; loc: any;

  ELEMENT_DATA: AlldelivaryReports[] = [];
  displayedColumns: string[] = ['user', 'total', 'completed', 'cod_amount', 'upi_amount', 'shiping_charge', 'amt_total'];
  dataSource = new MatTableDataSource<AlldelivaryReports>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, public datePipe: DatePipe) { }

  ngOnInit(): void {

    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }

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
    this.show()
  }

  getOrderList(data: any) {
    this.Api.DelivaryReport(data).subscribe(
      data => {
        if (!data.error) {
          this.dataSource.data = data as AlldelivaryReports[];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner = false;
        }
        else {
          console.log("Select Date Correctly");
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
  openSnackBar(text:any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition:'end',
      verticalPosition:'bottom'
    });
  }

  show() {
    this.error = 0;
    if (this.start && this.end) {
      this.spinner = true
      const filter = { start: this.datePipe.transform(this.start, 'yyyy-MM-dd'), end: this.datePipe.transform(this.end, 'yyyy-MM-dd') };
      this.getOrderList(filter)
    }
    else {
      this.error = 1;
      console.log(this.error)
    }

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export(): void {
    let element = document.getElementById('tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.filename);
  }

  getTotalUpi() {
    return this.dataSource.data.map(t => t.upi_amount).reduce((acc: any, value: any) => acc + value, 0);
  }
  getTotalCod() {
    return this.dataSource.data.map(t => t.cod_amount).reduce((acc: any, value: any) => acc + value, 0);
  }
  getTotalShipping() {
    return this.dataSource.data.map(t => t.shiping_charge).reduce((acc: any, value: any) => acc + value, 0);
  }
}
