import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CatagoryInterface } from 'src/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-catagory',
  templateUrl: './catagory.component.html',
  styleUrls: ['./catagory.component.css'],
  providers: [ApiService]
})
export class CatagoryComponent implements OnInit {

  spinner: any;
  eror: any;
  method = "post";
  catagory: any;
  t: any = true
  f: any = false
  x = 1
  image_checker: number = 0;
  image!: File;
  file!: File;
  uploadedImage!: File;
  url:any;
  utype: any; select: any; loc: any;
  ELEMENT_DATA: CatagoryInterface[] = [];
  displayedColumns: string[] = ['id', 'name', 'image', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<CatagoryInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('inputFile') inputFile!: ElementRef;

  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private ng2ImgMax: Ng2ImgMaxService, private snackBar: MatSnackBar) {
    this.catagory = { name: '', description: '', status: '' };
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
    this.url = this.Api.url;
    this.getCatagoryList();

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
        this.openSnackBar('Something went wrong ❎')
        console.log(error)
      }
    )
  }
  OnLOcationChange(){
    localStorage.setItem('loc',this.select)
    this.getCatagoryList();
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

  getCatagoryList() {
    this.spinner = true;
    this.Api.GetCatagory().subscribe(
      data => {
        this.dataSource.data = data as CatagoryInterface[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')
        console.log(error.error.detail)
        if(error.error.detail){
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate([''])
        }
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

  AddCatagory(method: any) {
    this.eror = 0;
    if (method == 'post') {
      if (this.catagory.name && (this.catagory.status==true||this.catagory.status==false) && this.image_checker == 1) {
        this.spinner = true;
        this.Api.PostCatagory(this.catagory, this.uploadedImage).subscribe(
          data => {
            if (data.msg == 1 || data.msg == 'success') {
              this.getCatagoryList();
              this.catagory = { name: '', description: '', status: '' };
              this.inputFile.nativeElement.value = '';  //
              this.image = this.file;                 //
              this.uploadedImage = this.file;         // Setting Flag To Default And imge Empty
              this.image_checker = 0;
              this.catagory.checker = 0;
              this.openSnackBar('Added Succesfully');
              this.spinner = false;
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
        this.eror = 1;
      }
    }
    else {
      if (this.image_checker == 1) {
        this.catagory.image = this.uploadedImage;
      }
      else {
        this.catagory.checker = 1;  // For checking in Api service that  image selected or not
      }
      if (this.catagory.name && (this.catagory.status==true||this.catagory.status==false) ) {
        this.spinner = true
        this.Api.PutCatagory(this.catagory).subscribe(
          data => {
            if (data.msg == 1 || data.msg == 'success') {
              this.getCatagoryList();
              this.catagory = { name: '', description: '', status: '' }
              this.method = "post";                       //
              this.inputFile.nativeElement.value = '';      //
              this.image = this.file;                     // Setting Flag To Default And imge Empty
              this.uploadedImage = this.file;             //
              this.image_checker = 0;
              this.catagory.checker = 0;
              this.openSnackBar('Updated Successfuly')
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
      else {
        this.eror = 1;
      }
    }
  }

  DeleteCatagory(pk: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.spinner = true
        this.Api.DeleteCatagory(pk).subscribe(
          data => {
            if (data.msg == 1 || data.msg == 'success') {
              this.getCatagoryList();
              console.log("Success");
              this.openSnackBar('Removed Successfully')
              this.spinner = false
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
            this.spinner = false
            this.openSnackBar('Something went wrong ❎')
          }
        )

      }
    });

  }

  Edit(id: any) {
    this.spinner = true;
    this.Api.GetSpecificCatagory(id).subscribe(
      data => {
        // console.log(data);
        this.catagory = { id: id, name: data.name, description: data.description, status: data.status, image: data.image }
        this.method = id;
        this.spinner = false;
      },
      error => {
        console.log(error);
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }
  clear() {
    this.catagory = { name: '', description: '', status: '' };
    this.method = "post"
    this.image_checker = 0;                     //
    this.catagory.checker = 0;
    this.inputFile.nativeElement.value = '';
    this.eror = 0;
  }

  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
