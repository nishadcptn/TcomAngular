import { HttpInterceptor } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: any, next: any) {
    if (req.headers.get('key') == 'null') {
      const newHeaders = req.headers.delete('key')
      const newRequest = req.clone({
        headers: newHeaders
      });
      return next.handle(newRequest);
    }
    else {
      let apiService = this.injector.get(ApiService)
      let tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Token ${apiService.getToken()}`
        }
      })
      return next.handle(tokenizedReq)
    }
  }
}
