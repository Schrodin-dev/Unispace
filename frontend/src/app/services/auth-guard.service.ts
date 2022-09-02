import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLogin()){
		if(!state.url.includes('/admin')) return true;

		switch(state.url){
			case '/admin/gestionUERessources':
			case '/admin/gestionGroupes':
			case '/admin/gestionThemes':
				return this.authService.isAdmin();
				break;
			default:
				return this.authService.isDelegue();
		}
    }else{
      this.router.navigate(["login"]);
      return false;
    }
  }
}
