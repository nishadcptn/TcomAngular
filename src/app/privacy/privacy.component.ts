import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  user: any;
  hide = true;
  eror: any;
  wrong = "Password required";
  location: any;
  image_checker: number = 0;
  image!: File;
  uploadedImage!: File;
  upiData: any;
  spinner = false;
  file!: File;
  url:any;
  @ViewChild('inputFile') inputFile!:ElementRef;

  constructor(private Api: ApiService, private snackBar: MatSnackBar, private ng2ImgMax: Ng2ImgMaxService,) {
    this.user = { password: '', newpass: '', confpass: '' }
    this.upiData = {};
  }

  ngOnInit(): void {
    this.Mylocation()
    this.url = this.Api.url;
  }
  ResetApi() {
    this.eror = 0;
    this.wrong = "Password required";
    if (this.user.password && (this.user.newpass).length >5 && this.user.confpass) {
      if (this.user.newpass == this.user.confpass) {
        const details = { password: this.user.password, newpass: this.user.newpass }
        this.Api.ResetPassword(details).subscribe(
          data => {
            if (data.msg == 'success') {
              this.openSnackBar('Password Reset Successfully');
              this.user = { password: '', newpass: '', confpass: '' }
              console.log('success')
            }
            else if (data.msg == 'fail') {
              this.eror = 1;
              this.wrong = "Invalid Password"
              this.openSnackBar('Invalid password')
            }
          },
          error => {
            console.log(error)
            this.openSnackBar('Something went wrong')
          }
        )
      }
      else {
        this.eror = 1;
        this.openSnackBar('Password Not Match')
      }
    }
    else {
      this.eror = 1;
    }

  }
  Mylocation() {
    this.Api.MyLocation().subscribe(
      data => {
        console.log(data)
        this.location = data;
        this.upiData.upi_number = data.upi_number
      },
      error => {
        console.log(error)
      }
    )
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
  clear() {
    this.user = { password: '', newpass: '', confpass: '' }
    this.wrong = "Password required";
    this.eror = 0;
  }

  openSnackBar(text: any) {
    this.snackBar.open(text, 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  UpdateUPI() {
    if (this.image_checker == 1) {
      this.upiData.image = this.uploadedImage;
    }
    else {
      this.upiData.checker = 1;
    }
    if (this.upiData.upi_number) {
      this.spinner = true;
      this.Api.PutLocation(this.upiData).subscribe(
        data => {
          console.log(data);

          if (data.msg === "success" || data.msg == 1) {
            this.Mylocation();
            this.image = this.file;                     // Setting Flag To Default And imge Empty
            this.uploadedImage = this.file;             //
            this.image_checker = 0;                     //
            this.upiData.checker = 0;                   //
            this.inputFile.nativeElement.value='';
            this.openSnackBar('Updated Successfully')
            this.spinner = false;
          }
        },
        error => {
          console.log(error);
          this.spinner = false;
          this.Mylocation();
        }
      )
    }
    else {
      this.eror = 1;
    }
  }
}

