import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditProductInterface, ProductInterface } from 'src/interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  catagory: any;
  select: any;
  spinner:any;
  utype: any; selectedloc: any; loc: any;
  ELEMENT_DATA: EditProductInterface[] = [];
  displayedColumns: string[] = ['id', 'name', 'price','discount','featured', 'actions'];
  dataSource = new MatTableDataSource<EditProductInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.getCatagoryList();
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
    this.getCatagoryList();
    this.getProductList(null)
  }

  getProductList(catagory: any) {
    this.Api.getCatagoryBasedroduct(catagory).subscribe(
      data => {
        console.log(data);

        this.dataSource.data = data as EditProductInterface[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner = false;
      },
      error => {
        console.log(error);
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')

      }
    )
  }

  getCatagoryList() {
    this.Api.GetCatagoryList().subscribe(
      data => {
        if (data) {
          this.catagory = data;
        }
      },
      error => {
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  seclectionChange() {
    this.getProductList(this.select);
    this.spinner = true;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  //Single Data Save
  save(id: any) {
    this.spinner = true;
    const sample = this.dataSource.data.filter(data => {
      return (data.id == id)
    })
    this.Api.UpdateProduct(sample[0]).subscribe(
      data => {
        if (data.msg ==1 || data.msg =='success') {
          this.openSnackBar('Updated Succesfully ')
          this.getProductList(this.select);
          this.spinner = false;
        }
        else {
          console.log(data);
          this.openSnackBar('Something went wrong ❎')
        }
      },
      error => {
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  //Save All
  saveAll() {
    console.log((this.dataSource.data).length);
    if ((this.dataSource.data).length === 0) {
      this.openSnackBar('No Data To Update!! 😤')
    }
    else {
      this.spinner = true;
      this.Api.UpdateAllProduct(this.dataSource.data).subscribe(
        data => {
          console.log(data);
          if (data.msg ==1 || data.msg =='success') {
            this.openSnackBar('Updated Succesfully ')
            this.spinner = false;
          }
          else{
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
  }

  openSnackBar(text:any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition:'end',
      verticalPosition:'bottom'
    });
  }
}
