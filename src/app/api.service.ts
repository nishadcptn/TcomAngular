import { HttpClient, HttpHeaders ,HttpEventType} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // baseurl = "https://tcom-python.herokuapp.com/";
  // url = "https://tcom-python.herokuapp.com";

  // baseurl = "http://tcomdelivery.in:8000/";
  // url = "http://tcomdelivery.in:8000";

  url = "http://127.0.0.1:8000";
  baseurl = "http://127.0.0.1:8000/";
  httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  httpHeadersForm = new HttpHeaders({ 'Content-type': 'multipart/form-data' })
  httpHeadersPublic = new HttpHeaders({ 'Content-type': 'application/json','key':'null' })
  data:any;
  status:any = null;
  date:any = null;
  orderDetails:any;

  constructor(private http: HttpClient) { }

  Login(user: any): Observable<any> {
    const body = { username:user.username,password:user.password};
    return this.http.post(this.baseurl +'login/', body, { headers :this.httpHeadersPublic});
  }

  GetCatagory(): Observable<any>{
    // return this.http.get(this.baseurl+'catagorys/'+this.getLocation(),{ headers: this.httpHeaders})
    return this.http.post(this.baseurl+'getcatagories/',{location:this.getLocation()},{ headers: this.httpHeaders})
  }

  GetCatagoryList(): Observable<any>{
    return this.http.get(this.baseurl+'catagorylist/' + this.getLocation(),{ headers: this.httpHeaders})
  }

  GetUnitList(): Observable<any>{
    return this.http.get(this.baseurl+'unit/',{ headers: this.httpHeaders})
  }

  GetSpecificCatagory(id:any): Observable<any>{
    return this.http.get(this.baseurl+'catagory/'+id,{ headers: this.httpHeaders})
  }

  PostCatagory(catagory:any,image:any):Observable<any>{
    const formData = new FormData();

    formData.append('name', catagory.name);
    formData.append('description', catagory.description);
    formData.append('status', catagory.status);
    formData.append('location', <any> this.getLocation() );
    formData.append('image', image);

    return this.http.post(this.baseurl +'catagory/',formData);
  }

  PutCatagory(catagory:any):Observable<any>{
    const formData = new FormData();

    formData.append('name', catagory.name);
    formData.append('description', catagory.description);
    formData.append('status', catagory.status);
    formData.append('location', <any> this.getLocation() );
    formData.append('image', catagory.image);

    if(catagory.checker){
      const body = {name: catagory.name,description:catagory.description,status:catagory.status};
      return this.http.put(this.baseurl +'catagory/'+ catagory.id ,body,{headers:this.httpHeaders});
    }
    else{
      return this.http.put(this.baseurl +'catagory/'+ catagory.id ,formData);
    }


  }

  DeleteCatagory(id:any):Observable<any>{
    return this.http.delete(this.baseurl + 'catagory/' +id, {headers:this.httpHeaders});
  }

  GetProducts(catagory:any): Observable<any>{
    const body = {category:catagory,location: this.getLocation()}
    // return this.http.get(this.baseurl+'products/'+ this.getLocation(),{ headers: this.httpHeaders})
    return this.http.post(this.baseurl+'getproducts/',body,{ headers: this.httpHeaders})
  }
  GetFeaturedProducts(): Observable<any>{
    return this.http.get(this.baseurl+'featuredproducts/'+ this.getLocation(),{ headers: this.httpHeaders})
  }
  PostProduct(product:any,image:any):Observable<any>{

    const formData = new FormData();


    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('status', product.status);
    formData.append('catagory', product.catagory);
    formData.append('price', product.price);
    formData.append('discount', product.discount);
    formData.append('unit', product.unit);
    formData.append('location',<any> this.getLocation() );
    formData.append('image', image);

    return this.http.post(this.baseurl +'product/',formData);
  }

  GetSpecificProduct(id:any): Observable<any>{
    return this.http.get(this.baseurl+'product/'+id,{ headers: this.httpHeaders})
  }

  PutProduct(product:any):Observable<any>{

    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('status', product.status);
    formData.append('catagory', product.catagory);
    formData.append('price', product.price);
    formData.append('discount', product.discount);
    formData.append('unit', product.unit);
    formData.append('image', product.image);

    if(product.checker){
      const body = {name: product.name,description:product.description,status:product.status,catagory:product.catagory,unit:product.unit,price:product.price,discount:product.discount};
      return this.http.put(this.baseurl +'product/'+ product.id,body,{headers:this.httpHeaders})
    }
    else{
      return this.http.put(this.baseurl +'product/'+ product.id ,formData);
    }
  }

  DeleteProduct(id:any):Observable<any>{
    return this.http.delete(this.baseurl + 'product/' +id, {headers:this.httpHeaders});
  }

  getCatagoryBasedroduct(catagory:any):Observable<any>{
    const body = {catagory:catagory}
    return this.http.post(this.baseurl+'selectedproduct/',body,{ headers: this.httpHeaders})
  }
  UpdateProduct(product:any):Observable<any>{   ////For Updating Single price of Product in the list
    return this.http.put(this.baseurl +'product/'+product.id,product,{headers:this.httpHeaders})
  }
  UpdateAllProduct(product:any):Observable<any>{   ////For Updating All Product in list
    return this.http.put(this.baseurl +'updateproduct/',product,{headers:this.httpHeaders})
  }

  GetDelivaryBoy(status:any): Observable<any>{
    const body = {location:this.getLocation(),status:status}
    return this.http.post(this.baseurl+'delivaryboys/',body,{ headers: this.httpHeaders})
  }

  getAllOrderDetails():Observable<any>{
    return this.http.get(this.baseurl + 'orders/' + this.getLocation(),{headers:this.httpHeaders})
  }

  getSpecficOrder(id:any):Observable<any>{
    return this.http.get(this.baseurl +'order/'+ id,{headers:this.httpHeaders})
  }

  UpdateOrder(order:any,id:any):Observable<any>{   ////For Updating Single price of Product in the list
    return this.http.put(this.baseurl +'order/'+ id, order,{headers:this.httpHeaders})
  }


  AddDelivaryBoy(delivary:any):Observable<any>{
    return this.http.put(this.baseurl +'assignorders/',delivary,{headers:this.httpHeaders})
  }

  FilterOrder(data:any):Observable<any>{
    return this.http.post(this.baseurl +'filterOrder/' + this.getLocation(),data,{headers:this.httpHeaders})
  }

  OrderDetailsApi(id:any): Observable<any>{
    return this.http.get(this.baseurl+'orderdetails/' +id,{ headers: this.httpHeaders})
  }

  DashBoard():Observable<any>{
    return this.http.get(this.baseurl + 'dashboard/' + this.getLocation(),{headers:this.httpHeaders});
  }
  DelReport():Observable<any>{
    return this.http.get(this.baseurl + 'delreport/' + this.getLocation(),{headers:this.httpHeaders});
  }

  ProductIncomeReport(data:any):Observable<any>{
    data.end = data.end + " 23:59:59";
    console.log(data)
    return this.http.post(this.baseurl +'productreport/'+this.getLocation(),data,{headers:this.httpHeaders})
  }
  OrderReport(data:any):Observable<any>{
    data.end = data.end + " 23:59:59";
    console.log(data)
    return this.http.post(this.baseurl +'orderreport/'+this.getLocation(),data,{headers:this.httpHeaders})
  }
  DelivaryReport(data:any):Observable<any>{
    data.end = data.end + " 23:59:59";
    console.log(data)
    return this.http.post(this.baseurl +'delivaryreport/'+this.getLocation(),data,{headers:this.httpHeaders})
  }
  IncomeReport(data:any):Observable<any>{
    data.end = data.end + " 23:59:59";
    console.log(data)
    return this.http.post(this.baseurl +'incomereport/'+this.getLocation(),data,{headers:this.httpHeaders})
  }

  AllIncomeReport(data:any):Observable<any>{
    data.end = data.end + " 23:59:59";
    console.log(data)
    return this.http.post(this.baseurl +'allincomereport/',data,{headers:this.httpHeaders})
  }

  NoticeApi():Observable<any>{
    return this.http.get(this.baseurl + 'notices/' + this.getLocation(),{headers:this.httpHeaders});
  }
  SpecificNoticeApi(id:any):Observable<any>{
    return this.http.get(this.baseurl + 'notice/' +id ,{headers:this.httpHeaders});
  }
  PostNotice(notice:any):Observable<any>{
    const body = {condent:notice.condent,title:notice.title,username:this.getUser(),location:this.getLocation(),last_date:notice.last_date};
    return this.http.post(this.baseurl + 'notice/',body,{headers:this.httpHeaders});
  }
  PutNotice(notice:any):Observable<any>{
    return this.http.put(this.baseurl + 'notice/' + notice.id,notice,{headers:this.httpHeaders});
  }

  BannerApi():Observable<any>{
    return this.http.get(this.baseurl + 'getbanner/' + this.getLocation(),{headers:this.httpHeaders});
  }
  SpecificBannerApi(id:any):Observable<any>{
    return this.http.get(this.baseurl + 'banner/' +id ,{headers:this.httpHeaders});
  }
  PostBanner(banner:any,image:any):Observable<any>{
    const formData = new FormData();

    formData.append('is_active', banner.is_active);
    formData.append('order', banner.order);
    formData.append('location', <any> this.getLocation() );
    formData.append('image', image);

    return this.http.post(this.baseurl +'banner/',formData);
  }
  PutLocation(location:any):Observable<any>{

    const formData = new FormData();

    formData.append('upi_number', location.upi_number);
    formData.append('qr_code', location.image);

    if(location.checker){
      const body = {upi_number: location.upi_number};
      return this.http.put(this.baseurl +'location/'+ this.getLocation(),body,{headers:this.httpHeaders})
    }
    else{
      return this.http.put(this.baseurl +'location/'+ this.getLocation() ,formData);
    }
  }

  DeleteBanner(id:any):Observable<any>{
    return this.http.delete(this.baseurl + 'banner/' +id, {headers:this.httpHeaders});
  }
  PutBanner(banner:any):Observable<any>{
      const body = {is_active: banner.is_active,order:banner.order};
      return this.http.put(this.baseurl +'banner/'+ banner.id ,body,{headers:this.httpHeaders});
  }
  RegisterApi(user:any):Observable<any>{
    let body;
    if(user.location){
      body = { name: user.name, username: user.username, gender: user.gender, phone: user.phone, password: user.password,location:user.location,usertype:0 };
    }
    else{
      body = { name: user.name, username: user.username, gender: user.gender, phone: user.phone, password: user.password,location:this.getLocation(),usertype:1 };
    }
    return this.http.post(this.baseurl+ 'register/',body,{headers:this.httpHeaders})
  }

  ResetPassword(user:any):Observable<any>{
    const body = {password:user.password, newpass:user.newpass, username:this.getUser()}
    return this.http.post(this.baseurl+ 'resetpassword/',body,{headers:this.httpHeaders})
  }

  DeliveryBoysStatusUpdate(data:any):Observable<any>{
    return this.http.put(this.baseurl +'updatestatus/',data,{headers:this.httpHeaders})
  }

  MyLocation():Observable<any>{
    return this.http.get(this.baseurl +'location/'+this.getLocation(),{headers:this.httpHeaders})
  }

  // --------------------------------

  GetAllLocation(): Observable<any>{
    return this.http.get(this.baseurl+'location/',{ headers: this.httpHeaders})
  }
  GetSpecificLocation(id:any): Observable<any>{
    return this.http.get(this.baseurl+'location/'+id,{ headers: this.httpHeaders})
  }
  PostLocation(location:any,image:any):Observable<any>{
    const formData = new FormData();

    formData.append('name', location.name);
    formData.append('address', location.address);
    formData.append('phone', location.phone);
    formData.append('upi_number', location.upi_number );
    formData.append('qr_code', image);

    return this.http.post(this.baseurl +'location/',formData);
  }

  UpdateLocation(location:any):Observable<any>{
    const formData = new FormData();

    formData.append('name', location.name);
    formData.append('address', location.address);
    formData.append('phone', location.phone);
    formData.append('upi_number', location.upi_number );
    formData.append('qr_code', location.image);

    if(location.checker){
      const body = {name: location.name,address:location.address,phone:location.phone,upi_number:location.upi_number};
      return this.http.put(this.baseurl +'location/'+ location.id ,body,{headers:this.httpHeaders});
    }
    else{
      return this.http.put(this.baseurl +'location/'+ location.id ,formData);
    }

  }

  DeleteLocation(id:any):Observable<any>{
    return this.http.delete(this.baseurl + 'location/' +id, {headers:this.httpHeaders});
  }

  GetAlladmin(): Observable<any>{
    return this.http.get(this.baseurl+'alladmin/',{ headers: this.httpHeaders})
  }

  UpdateUser(data:any):Observable<any>{
    return this.http.post(this.baseurl + 'alladmin/',data, {headers:this.httpHeaders});
  }

  getToken() {
    return sessionStorage.getItem('key')
  }
  getLocation() {
    return localStorage.getItem('loc')
  }
  getUser() {
    return localStorage.getItem('username')
  }
}
