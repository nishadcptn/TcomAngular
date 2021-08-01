import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderInterface } from 'src/interfaces';
import { ApiService } from '../api.service';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CancelAlertComponent } from '../cancel-alert/cancel-alert.component';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdersComponent implements OnInit {

  delivaryBoy: any;
  select: any;
  postData: any;
  date: any = new Date();
  selectedOrder: number[] = new Array;
  filter = { status: null, date: null };
  spinner: any;
  eror: any;
  er: any;  // SElec Error Handling
  utype: any; selectedloc: any; loc: any;
  expandedElement: OrderInterface | null | undefined;


  ELEMENT_DATA: OrderInterface[] = [];
  // 'address', 'phone','date', 'delivary_remarks','delivary_date',
  displayedColumns: string[] = ['id', 'inv_number', 'username','phone', 'payment_type', 'payment_status', 'shipper', 'shiping_charge', 'total_amount', 'grand_total','status', 'actions'];
  dataSource = new MatTableDataSource<OrderInterface>(this.ELEMENT_DATA);

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

    this.getDelivaryBoysList();

    if (this.Api.date != null) {
      this.filter.date = this.date = this.Api.date;
      this.filter.status = this.Api.status;

      this.GetFilteredOrder(this.filter);

      this.Api.date = null;
      this.Api.status = null;
    }
    else {
      this.GetAllOrders();
    }

    this.postData = { orders: '', shipper: '' };

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
  OnLOcationChange() {
    localStorage.setItem('loc', this.selectedloc)
    this.getDelivaryBoysList();
    this.GetAllOrders()
  }

  getDelivaryBoysList() {
    this.Api.GetDelivaryBoy(true).subscribe(
      data => {
        if (data) {
          this.delivaryBoy = data;
        }
      },
      error => {
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }
  Filter() {
    this.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');   // --------------- Date Convertion --------
    this.filter.date = this.date;
    if (this.filter.date && this.filter.status != null) {
      this.GetFilteredOrder(this.filter);
    }
    else {
      console.log("Not Selected");
      this.eror = 1;
      if (!this.filter.date) {
        this.openSnackBar('Choose  valid date')
      }
      else {
        this.openSnackBar('Select Order Status ')
      }
    }
  }


  GetFilteredOrder(filter: any) {
    this.spinner = true;
    this.Api.FilterOrder(this.filter).subscribe(
      data => {
        this.dataSource.data = data as OrderInterface[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner = false;
      },
      error => {
        console.log(error)
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }


  GetAllOrders() {
    this.spinner = true
    this.Api.getAllOrderDetails().subscribe(
      data => {
        this.dataSource.data = data as OrderInterface[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner = false
      },
      error => {
        console.log(error);
        this.spinner = false;
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

  checkeOrder(id: any) {
    this.selectedOrder.push(id)
  }

  AssignOrder() {
    this.er = 0;
    this.postData = { orders: this.selectedOrder, shipper: this.select };
    if (this.selectedOrder.length != 0 && this.select) {
      this.spinner = true;
      this.Api.AddDelivaryBoy(this.postData).subscribe(
        data => {
          if (data.msg == "success" || data.msg == 1) {
            this.GetAllOrders()
            this.postData = { orders: '', shipper: '' };
            this.select = '';
            this.selectedOrder = new Array();
            this.openSnackBar("Order Assigned Succesfully")
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
    else {
      this.openSnackBar("Select the Order And Shiper Correctly")
      this.er = 1
    }
  }

  View(id: any) {
    this.Api.data = id;
    this.Api.date = this.filter.date;
    this.Api.status = this.filter.status
    this.router.navigate(['home/orderdetails'])
  }
  CancelOrder(id: any) {
    const dialogRef = this.dialog.open(CancelAlertComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        const order = { status: 4 };
        this.spinner = true
        this.Api.UpdateOrder(order, id).subscribe(
          data => {
            if (data.msg == "success" || data.msg == 1) {
              this.GetAllOrders();
              this.openSnackBar('Order Canceled')
              this.spinner = false
            }
          },
          error => {
            console.log(error);
            this.spinner = false
            this.openSnackBar('Something went wrong ❎')
          }
        )
      }
    }
    )
  }

  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
