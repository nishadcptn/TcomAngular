import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductInterface } from 'src/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['../app.component.css']
})
export class FeaturedProductsComponent implements OnInit {

  spinner : any;
  url:any;
  utype: any; selectedloc: any; loc: any;
   ELEMENT_DATA: ProductInterface[] = [];
  displayedColumns: string[] = ['id', 'name','unit', 'catagory', 'description', 'price', 'image', 'status'];
  dataSource = new MatTableDataSource<ProductInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private Api: ApiService, private router: Router,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
    this.url = this.Api.url;
    this.getProductList();

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
    this.getProductList();
  }

  getProductList() {
    this.spinner = true;
    this.Api.GetFeaturedProducts().subscribe(
      data => {
        this.dataSource.data = data as ProductInterface[];
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
