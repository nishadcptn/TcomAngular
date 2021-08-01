import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LocationInterface } from 'src/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {


  spinner: any;
  eror: any;
  method = "post";
  location: any;
  t: any = true
  f: any = false
  x = 1
  image_checker: number = 0;
  image!: File;
  file!: File;
  uploadedImage!: File;
  url:any;

  ELEMENT_DATA: LocationInterface[] = [];
  displayedColumns: string[] = ['id', 'name','address','phone', 'image', 'upi_number', 'actions'];
  dataSource = new MatTableDataSource<LocationInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('inputFile') inputFile!: ElementRef;

  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private ng2ImgMax: Ng2ImgMaxService, private snackBar: MatSnackBar) {
    this.location = {id: '', name: '', address: '', phone: '',upi_number:'', qr_code: '' };
  }

  ngOnInit(): void {
    const utype:any = localStorage.getItem('utype')
    if (!sessionStorage.getItem('key') ||  utype!=3) {
      this.router.navigate([''])
    }
    this.getLocationList();
    this.url = this.Api.url
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

  getLocationList() {
    this.spinner = true;
    this.Api.GetAllLocation().subscribe(
      data => {
        this.dataSource.data = data as LocationInterface[];
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

  AddLocation(method: any) {
    this.eror = 0;
    if (method == 'post') {
      if (this.location.name && this.location.address && (this.location.phone).length>9 && (this.location.phone).length<11  && (this.location.upi_number).length >9  && this.location.upi_number.length <11 && this.image_checker == 1) {
        this.spinner = true;
        this.Api.PostLocation(this.location, this.uploadedImage).subscribe(
          data => {
            if (data.msg == 1 || data.msg == 'success') {
              this.getLocationList();
              this.location = {id: '', name: '', address: '', phone: '',upi_number:'', qr_code: ''};
              this.inputFile.nativeElement.value = '';  //
              this.image = this.file;                 //
              this.uploadedImage = this.file;         // Setting Flag To Default And imge Empty
              this.image_checker = 0;
              this.location.checker = 0;
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
        console.log("missing");

      }
    }
    else {
      if (this.image_checker == 1) {
        this.location.image = this.uploadedImage;
      }
      else {
        this.location.checker = 1;  // For checking in Api service that  image selected or not
      }
      if (this.location.name && this.location.address && (this.location.phone).length>9 && (this.location.phone).length<11  && (this.location.upi_number).length >9  && this.location.upi_number.length <11 ) {
        this.spinner = true
        this.Api.UpdateLocation(this.location).subscribe(
          data => {
            if (data.msg == 1 || data.msg == 'success') {
              this.getLocationList();
              this.location = {id: '', name: '', address: '', phone: '',upi_number:'', qr_code: ''}
              this.method = "post";                       //
              this.inputFile.nativeElement.value = '';      //
              this.image = this.file;                     // Setting Flag To Default And imge Empty
              this.uploadedImage = this.file;             //
              this.image_checker = 0;
              this.location.checker = 0;
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
        this.openSnackBar('Something went wrong ❎')
      }
    }
  }

  DeleteLocation(pk: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.spinner = true
        this.Api.DeleteLocation(pk).subscribe(
          data => {
            if (data.msg == 1 || data.msg == 'success') {
              this.getLocationList();
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
    this.Api.GetSpecificLocation(id).subscribe(
      data => {
        // console.log(data);
        this.location = { id: id, name: data.name, address: data.address, phone: data.phone,upi_number:data.upi_number, qr_code: data.qr_code }
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
    this.location = {};
    this.method = "post"
    this.image_checker = 0;                     //
    this.location
    .checker = 0;
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
