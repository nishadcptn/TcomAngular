import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NoticeIF } from 'src/interfaces';
import { ApiService } from '../api.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['../app.component.css']
})
export class NoticeComponent implements OnInit {

  notice: any;
  spinner: any;
  eror: any;
  method = "post";
  noticeDatata = { title: '', condent: '' };
  filename = 'ExelSheet.xlsx';
  utype: any; selectedloc: any; loc: any;

  ELEMENT_DATA: NoticeIF[] = [];
  displayedColumns: string[] = ['id', 'title', 'condent', 'date', 'actions'];
  dataSource = new MatTableDataSource<NoticeIF>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;


  constructor(private Api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllNotice()

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
    this.getAllNotice();
  }

  getAllNotice() {
    this.spinner = true;
    this.Api.NoticeApi().subscribe(
      data => {
        this.notice = data;
        this.dataSource.data = data as NoticeIF[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log(this.notice);
        this.spinner = false;

      },
      error => {
        console.log(error);
        this.spinner = false
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

  PostNotice() {
    this.eror = 0;
    if (this.method == "post") {
      if (this.noticeDatata.condent && this.noticeDatata.title) {
        this.spinner = true;
        this.Api.PostNotice(this.noticeDatata).subscribe(
          data => {
            console.log(data)
            if (data.msg == "success" || data.msg == 1) {
              this.getAllNotice()
              this.noticeDatata = { title: '', condent: '' };
              this.openSnackBar('Added Successfully')
              this.spinner = false;
            }
            else{
              this.spinner =false;
              this.openSnackBar('Something went wrong ❎')
            }
          },
          error => {
            this.spinner = false;
            console.log(error)
            this.openSnackBar('Something went wrong ❎')
          }
        )
      }
      else {
        this.eror = 1;
      }
    }
    else {
      if (this.noticeDatata.title && this.noticeDatata.condent) {
        this.spinner = true;
        this.Api.PutNotice(this.noticeDatata).subscribe(
          data => {
            if (data.msg == "success" || data.msg == 1) {
              this.method = "post";
              this.noticeDatata = { title: '', condent: '' };
              this.getAllNotice()
              this.openSnackBar('Updated Successfully')
              this.spinner = false;
            }
            else {
              console.log("error", data)
              this.spinner = false;
              this.openSnackBar('Something went wrong ❎')
            }
          },
          error => {
            console.log(error)
            this.spinner = false;
            this.openSnackBar('Something went wrong ❎')
          }
        )
      }
      else {
        this.eror = 1;
      }
    }
  }
  Delete(id: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.spinner = true
        const details = { id: id, is_delete: true };
        this.Api.PutNotice(details).subscribe(
          data => {
            if (data.msg == "success" || data.msg == 1) {
              this.getAllNotice()
              this.openSnackBar('Removed Successfully')
              this.spinner = false;
            }
            else {
              console.log("error", data)
              this.spinner = false
              this.openSnackBar('Something went wrong ❎')
            }
          },
          error => {
            console.log(error)
            this.spinner = false
            this.openSnackBar('Something went wrong ❎')
          }
        )

      }
    }
    )
  }
  Edit(id: any) {
    this.spinner = true;
    this.Api.SpecificNoticeApi(id).subscribe(
      data => {
        if (data.id) {
          this.noticeDatata = data;
          this.method = data.id;
          this.spinner = false;
        }
        else {
          console.log(data)
          this.spinner = false;
          this.openSnackBar('Something went wrong ❎')
        }
      },
      error => {
        console.log(error);
        this.spinner = false
        this.openSnackBar('Something went wrong ❎')

      }
    )
  }
  export(): void {
    let element = document.getElementById('tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.filename);
  }
  Clear() {
    this.method = "post";
    this.noticeDatata = { title: '', condent: '' };
  }
  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
