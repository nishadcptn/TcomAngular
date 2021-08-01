import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { AllIncomeReportComponent } from './all-income-report/all-income-report.component';
import { BannerComponent } from './banner/banner.component';
import { CatagoryComponent } from './catagory/catagory.component';
import { DeliveryBoysRegistrationComponent } from './delivery-boys-registration/delivery-boys-registration.component';
import { DeliveryReportComponent } from './delivery-report/delivery-report.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { HomeCardComponent } from './home-card/home-card.component';
import { HomeComponent } from './home/home.component';
import { IncomeReportComponent } from './income-report/income-report.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { NoticeComponent } from './notice/notice.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderReportComponent } from './order-report/order-report.component';
import { OrdersComponent } from './orders/orders.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProductReportComponent } from './product-report/product-report.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'home',component:HomeComponent,children:[
      {path:'',component:HomeCardComponent},
      {path:'catagory',component:CatagoryComponent},
      {path:'products',component:ProductComponent},
      {path:'editproduct',component:EditProductComponent},
      {path:'orders',component:OrdersComponent},
      {path:'orderdetails',component:OrderDetailsComponent},
      {path:'productreport',component:ProductReportComponent},
      {path:'orderreport',component:OrderReportComponent},
      {path:'deliveryreport',component:DeliveryReportComponent},
      {path:'incomereport',component:IncomeReportComponent},
      {path:'featuredproduct',component:FeaturedProductsComponent},
      {path:'notice',component:NoticeComponent},
      {path:'banner',component:BannerComponent},
      {path:'deliveryboys',component:DeliveryBoysRegistrationComponent},
      {path:'privacy',component:PrivacyComponent},
      {path:'location',component:LocationComponent},
      {path:'allincome',component:AllIncomeReportComponent},
      {path:'admin',component:AdminRegisterComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
