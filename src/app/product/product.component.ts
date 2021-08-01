import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductInterface } from 'src/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ApiService]
})
export class ProductComponent implements OnInit {

  method = "post";
  product: any;
  catagory:any;
  select: any;
  url:any;
  unit:any;
  t :any=true;
  f :any=false;
  image_checker:number =0;
  eror :any;
  spinner:any;
  image!: File;
  file!: File;
  uploadedImage!: File;
  utype: any; selectedloc: any; loc: any;

  ELEMENT_DATA: ProductInterface[] = [];
  displayedColumns: string[] = ['id', 'name','unit', 'description', 'price','discount', 'image', 'status', 'actions'];
  dataSource = new MatTableDataSource<ProductInterface>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('inputFile') inputFile!:ElementRef;

  constructor(private Api: ApiService, private router: Router, private dialog: MatDialog, private ng2ImgMax: Ng2ImgMaxService,private snackBar: MatSnackBar) {
    this.product = { name: '', description: '', status: '' ,discount:'',unit:''};
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('key')) {
      this.router.navigate([''])
    }
    this.getCatagoryList();
    this.getUnitList();
    this.url = this.Api.url;

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
  }

  getImage(event:any){
    this.image = event.target.files[0];

    this.ng2ImgMax.resizeImage(this.image, 400, 300).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        this.image_checker = 1;
      },
      error => {
        console.log('Error :', error);
        this.openSnackBar('Something went wrong ❎')
      }
    );

  }

  getProductList(catagory:any) {
    this.spinner = true;
    this.Api.GetProducts(catagory).subscribe(
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

  getCatagoryList(){
    this.Api.GetCatagoryList().subscribe(
      data =>{
        if(data){
          this.catagory = data;
        }
      },
      error  =>{
        console.log(error);
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  getUnitList(){
    this.Api.GetUnitList().subscribe(
      data =>{
        if(data){
          this.unit = data;
        }
      },
      error  =>{
        console.log(error);
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

  AddProduct(method: any) {
    this.eror = 0
    if (method == 'post') {
      if(this.product.name && (this.product.status ==true || this.product.status ==false) && this.product.catagory && this.product.price && this.product.unit && this.product.discount && this.image_checker ==1){
        this.spinner = true
      this.Api.PostProduct(this.product,this.uploadedImage).subscribe(
        data => {
          if (data.msg === "success"||data.msg ==1) {
            this.getProductList(this.select);
            this.product = { name: '', description: '', status: '', catagory: '', price: '' ,unit: '',discount:''};

            this.inputFile.nativeElement.value='';  //
            this.image = this.file;                 //
            this.uploadedImage = this.file;         // Setting Flag To Default And imge Empty
            this.image_checker = 0;                 //
            this.product.checker = 0;               //
            this.openSnackBar('Added Successfully')
            this.spinner =  false
          }
          else {
            console.log("Error :)");
            console.log(data);
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
      else{
        this.eror = 1
      }

    }
    else {
      if (this.image_checker==1){
        this.product.image = this.uploadedImage;
      }
      else{
        this.product.checker = 1;
      }
      if(this.product.name &&  (this.product.status ==true || this.product.status ==false)  && this.product.catagory && this.product.price && this.product.unit && this.product.discount){
        this.spinner = true;
      this.Api.PutProduct(this.product).subscribe(
        data => {
          console.log(data);

          if (data.msg === "success"||data.msg ==1) {
            this.getProductList(this.select);
            this.product = { name: '', description: '', status: '', catagory: '', price: '',discount:'' };

            this.method = "post";                       //
            this.inputFile.nativeElement.value='';      //
            this.image = this.file;                     // Setting Flag To Default And imge Empty
            this.uploadedImage = this.file;             //
            this.image_checker = 0;                     //
            this.product.checker = 0;                   //
            this.openSnackBar('Updated Successfully')
            this.spinner = false;
          }
          else{
            this.spinner =false;
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
      else{
        this.eror = 1;
      }
    }
  }

  DeleteProduct(pk: any) {

    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.spinner = true;
        this.Api.DeleteProduct(pk).subscribe(
          data => {
            if (data.msg === "success"||data.msg ==1) {
              this.getProductList(this.select);
              console.log("Success");
              this.openSnackBar('Removed Successfully')
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
            this.spinner = false
            this.openSnackBar('Something went wrong ❎')
          }
        )

      }
    });

  }

  seclectionChange() {
    this.getProductList(this.select);
  }

  Edit(id: any) {
    this.spinner = true;
    this.Api.GetSpecificProduct(id).subscribe(
      data => {
        // this.product = { id: id, name: data.name, description: data.description, status: data.status, catagory: data.catagory, price: data.price, image: data.image }  //edittttttt
        this.product = data as ProductInterface;
        console.log(data);
        this.method = id;
        this.spinner = false
      },
      error => {
        console.log(error);
        this.spinner = false;
        this.openSnackBar('Something went wrong ❎')
      }
    )
  }

  clear(){
    this.product = { name: '', description: '', status: '', catagory: '', price: '',discount:'' };
    this.method ="post"
    this.image_checker = 0;                     //
    this.product.checker = 0;
    this.inputFile.nativeElement.value='';
    this.eror = 0
  }

  openSnackBar(text:any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition:'end',
      verticalPosition:'bottom'
    });
  }

}
