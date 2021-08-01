export interface CatagoryInterface{
  id:number,
  name:string,
  description:string,
  status:boolean,
  image:string
}
export interface ProductInterface{
  id:number,
  name:string,
  unit:string,
  catagory:string,
  description:string,
  price:number,
  discount:number,
  image:string,
  status:boolean
}
export interface EditProductInterface{
  id:number,
  name:string,
  price:number,
  featured:boolean,
}

export interface OrderInterface{
  id:number,
  username:object
  shipper:any,
  date:Date,
  delivary_date:Date,
  status:number,
  payment_status:boolean,
  inv_number:number,
  total_amount:number,
  delivary_remarks:string,
  address:object,
  payment_type:number,
  shiping_charge:number
}

export interface OrderDetailsInterface{
  id:number,
  date:Date,
  quantity:number,
  amount:number,
  status:boolean,
  order:object,
  product:object
}

export interface delivaryReports{
  first_name:string,
  last_name:string,
  total:number,
  completed:number,
  amount:number
}

export interface ProductIncomeIF{
  qty_sum:number,
  amount:number,
  product:string,
  id:number,
  unit:string,
}

export interface OrderReport{
  inv_number:number,
  usrname:object,
  total_amount:number,
  payment_type:number,
  shiping_charge:number
}

export interface AlldelivaryReports{
  first_name:string,
  last_name:string,
  total:number,
  completed:number,
  upi_amount:number,
  cod_amount:number,
  shiping_charge:number
}

export interface IncomeReportInterface{
  total:number,
  completed:number,
  canceled:number,
  upi_amount:number,
  cod_amount:number
}

export interface AllIncomeReportInterface{
  location:string,
  total:number,
  completed:number,
  canceled:number,
  upi_amount:number,
  cod_amount:number
}

export interface BannerInterface{
  id:number,
  image:string,
  is_active:Boolean,
  order:number,
  location:number
}

export interface NoticeIF{
  id:number,
  title:string,
  condent:Boolean,
  date:number,
  username:number,
  location:number,
  is_delete:Boolean
}

export interface DeliveryBoys{
  username:object,
  phone:string,
  gender:string,
  usertype:number,
  location:object
}

export interface LocationInterface{
  id:number,
  name:string,
  address:string,
  phone:string,
  longitude:number,
  latitude:number,
  upi_number:string,
  qr_code:string
}
