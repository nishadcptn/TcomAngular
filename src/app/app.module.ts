import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from "@angular/material/button";
import { HttpInterceptorService } from './http-interceptor.service';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { CatagoryComponent } from './catagory/catagory.component';
import { ProductComponent } from './product/product.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { EditProductComponent } from './edit-product/edit-product.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { OrdersComponent } from './orders/orders.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { HomeCardComponent } from './home-card/home-card.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProductReportComponent } from './product-report/product-report.component';
import { OrderReportComponent } from './order-report/order-report.component';
import { DeliveryReportComponent } from './delivery-report/delivery-report.component';
import { IncomeReportComponent } from './income-report/income-report.component';
import {MatCardModule} from '@angular/material/card';
import { NoticeComponent } from './notice/notice.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { BannerComponent } from './banner/banner.component';
import {NgxPrintModule} from 'ngx-print';
import { DeliveryBoysRegistrationComponent } from './delivery-boys-registration/delivery-boys-registration.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { LocationComponent } from './location/location.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AllIncomeReportComponent } from './all-income-report/all-income-report.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { CancelAlertComponent } from './cancel-alert/cancel-alert.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavBarComponent,
    FooterComponent,
    CatagoryComponent,
    ProductComponent,
    DeleteDialogComponent,
    EditProductComponent,
    OrdersComponent,
    OrderDetailsComponent,
    HomeCardComponent,
    ProductReportComponent,
    OrderReportComponent,
    DeliveryReportComponent,
    IncomeReportComponent,
    NoticeComponent,
    FeaturedProductsComponent,
    BannerComponent,
    DeliveryBoysRegistrationComponent,
    LocationComponent,
    PrivacyComponent,
    AllIncomeReportComponent,
    AdminRegisterComponent,
    CancelAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    Ng2ImgMaxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatCardModule,
    NgxPrintModule,
    MatSlideToggleModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
