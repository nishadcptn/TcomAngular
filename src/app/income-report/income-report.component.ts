import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IncomeReportInterface } from 'src/interfaces';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['../app.component.css'],
  providers: [DatePipe]
})
export class IncomeReportComponent implements OnInit {


  array: any;
  select: any;
  date = new Date();
  start: any;
  end: any;
  error: any;
  spinner: any;
  ELEMENT_DATA: IncomeReportInterface[] = [];
  displayedColumns: string[] = ['total', 'completed', 'canceled', 'pending', 'cod_amount', 'upi_amount', 'shiping_charge', 'amt_total'];
  dataSource = new MatTableDataSource<IncomeReportInterface>(this.ELEMENT_DATA);


  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, public datePipe: DatePipe) { }

  ngOnInit(): void {

    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
  }

  getOrderList(data: any) {
    this.Api.IncomeReport(data).subscribe(
      data => {
        if (!data.error) {
          this.dataSource.data = data as IncomeReportInterface[];
          this.array = data[0];
          this.spinner = false;
        }
        else {
          console.log("Select Date Correctly");
          this.spinner = false;
          this.openSnackBar('Something went wrong ❎')
        }
      },
      error => {
        console.log(error);
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')
      }
    )

  }


  show() {
    this.error = 0;
    if (this.start && this.end) {
      this.spinner = true;
      const filter = { start: this.datePipe.transform(this.start, 'yyyy-MM-dd'), end: this.datePipe.transform(this.end, 'yyyy-MM-dd') };
      this.getOrderList(filter)
    }
    else {
      this.error = 1;
      console.log(this.error);

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
