import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {  AllIncomeReportInterface } from 'src/interfaces';
import { ApiService } from '../api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-all-income-report',
  templateUrl: './all-income-report.component.html',
  styleUrls: ['../app.component.css'],
  providers:[DatePipe]
})
export class AllIncomeReportComponent implements OnInit {
  array: any;
  select: any;
  date= new Date();
  start:any;
  end:any;
  error:any;
  spinner:any;
  filename = "IncomeReport" + this.date + ".xlsx"
  ELEMENT_DATA: AllIncomeReportInterface[] = [];
  displayedColumns: string[] = ['location','total','completed','canceled','pending','cod_amount','upi_amount','shiping_charge','amt_total'];
  dataSource = new MatTableDataSource<AllIncomeReportInterface>(this.ELEMENT_DATA);


  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar ,public datePipe: DatePipe) { }

  ngOnInit(): void {

    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
  }

  getOrderList(data: any) {
    this.Api.AllIncomeReport(data).subscribe(
      data => {
        if (!data.error){
          this.dataSource.data = data as AllIncomeReportInterface[];
          this.array = data[0];
          this.spinner = false;
        }
        else{
          console.log("Select Date Correctly");
          this.spinner = false;
        }
      },
      error => {
        console.log(error);
        this.spinner = false;

      }
    )

  }


show(){
  this.error =0;
  if(this.start && this.end){
    this.spinner = true;
  const filter ={start:this.datePipe.transform(this.start, 'yyyy-MM-dd'),end:this.datePipe.transform(this.end, 'yyyy-MM-dd')};
  this.getOrderList(filter)
  }
  else{
    this.error = 1;
    console.log(this.error);

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

}
