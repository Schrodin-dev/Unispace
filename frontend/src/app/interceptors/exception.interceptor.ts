import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import {catchError, retry, tap} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from "../services/auth.service";
import {Injectable} from "@angular/core";

@Injectable()
export class ExceptionIntercept implements HttpInterceptor {

	constructor(private authService: AuthService) {
	}

	intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
		return next.handle(request)
			.pipe(
				retry(1),
				tap(event => {

				},
					error => {
						if(error instanceof HttpErrorResponse && error.error.name === 'TokenExpiredError'){
							console.log("Token invalide, déconnexion.");
							this.authService.disconnect();
						}
					})
			)
	}

}
