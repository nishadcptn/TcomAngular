import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BannerInterface } from 'src/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {


  method = "post";
  banner: any;
  t: any = true
  f: any = false
  image_checker: number = 0;
  image!: File;
  file!: File;
  uploadedImage!: File;
  spinner: any;
  eror: any;
  url: any;
  utype: any; select: any; loc: any;

  ELEMENT_DATA: BannerInterface[] = [];
  displayedColumns: string[] = ['id', 'image', 'order', 'is_active', 'actions'];
  dataSource = new MatTableDataSource<BannerInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('inputFile') inputFile!: ElementRef;

  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private ng2ImgMax: Ng2ImgMaxService, private snackBar: MatSnackBar) {
    this.banner = { order: '', is_active: '' };
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
    this.getBannerList();
    this.url = this.Api.url
    this.utype = localStorage.getItem('utype');

    if (this.utype == 3) {
      this.getlocation()
      this.select = Number(localStorage.getItem('loc'));
    }
  }
  getlocation() {
    this.Api.GetAllLocation().subscribe(
      data => {
        this.loc = data;
      },
      error => {
        console.log(error);
      }
    )
  }
  OnLOcationChange(){
    localStorage.setItem('loc',this.select)
    this.getBannerList();
  }
  getImage(event: any) {
    this.image = event.target.files[0];

    this.ng2ImgMax.resizeImage(this.image, 400, 300).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        this.image_checker = 1;
      },
      error => {
        console.log('Error :', error);
      }
    );

  }

  getBannerList() {
    this.spinner = true;
    this.Api.BannerApi().subscribe(
      data => {
        this.dataSource.data = data as BannerInterface[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner = false;
      },
      error => {
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

  AddBanner(method: any) {
    this.eror = 0
    if (method == 'post') {
      if (this.banner.order && this.image_checker == 1 && this.banner.is_active) {
        this.spinner = true
        this.Api.PostBanner(this.banner, this.uploadedImage).subscribe(
          data => {
            if (data.msg === "success" || data.msg == 1) {
              this.getBannerList();
              this.banner = { order: '', is_active: '' };
              this.inputFile.nativeElement.value = '';  //
              this.image = this.file;                 //
              this.uploadedImage = this.file;         // Setting Flag To Default And imge Empty
              this.image_checker = 0;
              this.banner.checker = 0;
              this.openSnackBar('Added Successfuly')
              this.spinner = false
            }
            else {
              console.log("Error :)");
              console.log(data);
              this.spinner = false
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
      else {
        console.log("No data")
        this.eror = 1
      }
    }
    else {
      console.log(this.banner);
      if (this.banner.order && this.banner.is_active) {
        this.Api.PutBanner(this.banner).subscribe(
          data => {
            if (data.msg === "success" || data.msg == 1) {
              this.getBannerList();
              this.banner = { order: '', is_active: '' };
              this.method = "post";                       //
              this.openSnackBar('Updated Successfuly')
            }
          },
          error => {
            console.log(error);
            this.openSnackBar('Something went wrong ❎')
          }
        )
      }
      else {
        this.eror = 1;
      }
    }
  }

  DeleteBanner(pk: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.spinner = true;
        this.Api.DeleteBanner(pk).subscribe(
          data => {
            if (data.msg === "success" || data.msg == 1) {
              this.getBannerList();
              console.log("Success");
              this.openSnackBar("Removed Succesfuly")
              this.spinner = false;
            }
            else {
              console.log("Error :)");
              console.log(data.msg);
              this.spinner = false
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
    });

  }

  Edit(id: any) {
    this.spinner = true;
    this.Api.SpecificBannerApi(id).subscribe(
      data => {
        console.log(data);
        this.banner = { id: id, order: data.order, is_active: data.is_active, image: data.image }
        this.method = id;
        this.spinner = false;
      },
      error => {
        console.log(error);
        this.spinner = false;
      }
    )
  }
  clear() {
    this.banner = { order: '', is_active: '' };
    this.method = "post"
    this.image_checker = 0;                     //
    this.banner.checker = 0;
    this.inputFile.nativeElement.value = '';
    this.eror = 1
  }
  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
