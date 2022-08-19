import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from "./services/auth.service";
import {Injectable} from "@angular/core";

@Injectable()
export class ExceptionIntercept implements HttpInterceptor {

	constructor(private authService: AuthService) {
	}

	intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
		return next.handle(request)
			.pipe(
				retry(1),
				catchError((error: HttpErrorResponse) => {
					let message = '';
					if (error.error instanceof ErrorEvent) {
						// handle client-side error
						message = `Error: ${error.error.message}`;
					} else {
						// handle server-side error
						if(error.error.name === 'TokenExpiredError'){
							this.authService.disconnect();
						}

						message = `Error Status: ${error.status}\nMessage: ${error.message}`;
					}
					return throwError(message);
				})
			)
	}

}
