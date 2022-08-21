import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
	constructor(private authService: AuthService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if(this.authService.isLogin()){
			const modifiedReq = req.clone(AuthInterceptor.getRequestOptions());
			return next.handle(modifiedReq);
		}

		return next.handle(req);
	}

	private static getRequestOptions(): { headers: HttpHeaders }{
		let headers =  new HttpHeaders();
		headers = headers.append('Content-Type', 'application/json; charset=utf-8');
		headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem("token"));
		return { headers: headers };
	}
}
