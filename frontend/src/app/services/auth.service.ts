import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import backend from "../../assets/config/backend.json";
import {BehaviorSubject, Observable, ObservableInput, Subject, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable()
export class AuthService{
  private loginRes:any;
	public couleurPrincipale: Subject<String> = new BehaviorSubject<String>(sessionStorage.getItem("couleurPrincipale") || 'AD1FB7');
	public couleurFond: Subject<String> = new BehaviorSubject<String>(sessionStorage.getItem("couleurFond") || 'ffffff');
	public sourceImageTheme: Subject<String> = new BehaviorSubject<String>(sessionStorage.getItem("sourceImageTheme") || 'une source');
	public theme: Subject<String> = new BehaviorSubject<String>(sessionStorage.getItem("theme") || '1');
	public couleurTexte: Subject<String> = new BehaviorSubject<String>(sessionStorage.getItem("textColor") || 'light');

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  register(nom:String, prenom:String, email:String, password:String, classe:String, groupe:any): Promise<any>{
    return this.httpClient
      .post(backend.url + '/api/auth/register', {
        nom: nom,
        prenom: prenom,
        email: email,
        password: password,
        classe: classe,
        groupe: groupe
      })
		.toPromise();
  }

  login(email:String, password:String):Promise<any>{
    return this.httpClient
      .post(backend.url + '/api/auth/login', {
        email: email,
        password: password
      })
		.toPromise()
		.then((res) => {
			// @ts-ignore
			if(res.message){
				return res;
			}

			this.loginRes = res;
			// @ts-ignore
			sessionStorage.setItem("email", email);
			sessionStorage.setItem("token", this.loginRes.token);
			sessionStorage.setItem("groupe", this.loginRes.groupe);
			sessionStorage.setItem("droits", this.loginRes.droits);
			sessionStorage.setItem("nom", this.loginRes.nom);
			sessionStorage.setItem("prenom", this.loginRes.prenom);

			this.updateTheme(this.loginRes.couleurPrincipale, this.loginRes.couleurFond, this.loginRes.sourceImageTheme, this.loginRes.theme)

			this.router.navigate(['']);

			return res;
		});
  }

  disconnect(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  getEmail(){
    return sessionStorage.getItem("email");
  }

  getToken(){
    return sessionStorage.getItem("token");
  }

  isLogin(){
    return (sessionStorage.getItem("token") !== null);
  }

  getNom(){
    return sessionStorage.getItem("nom");
  }

  getPrenom(){
    return sessionStorage.getItem("prenom");
  }

  getGroupe(){
    return sessionStorage.getItem("groupe");
  }

  getDroits(){
    return sessionStorage.getItem("droits");
  }

  getUserInfos(){
    return {
      nom: this.getNom(),
      prenom: this.getPrenom(),
      email: this.getEmail(),
      groupe: this.getGroupe()
    };
  }

  	updateTheme(couleurPrincipale: string, couleurFond: string, source: string, theme: string){
		//mise à jour du theme
		this.couleurPrincipale.next(couleurPrincipale);
		sessionStorage.setItem("couleurPrincipale", couleurPrincipale);
		this.couleurFond.next(couleurFond);
		sessionStorage.setItem("couleurFond", couleurFond);
		this.sourceImageTheme.next(source);
		sessionStorage.setItem("sourceImageTheme", source);
		this.theme.next(theme);
		sessionStorage.setItem("theme", theme);

		sessionStorage.setItem("textColor", this.lightOrDark(couleurFond));
		// @ts-ignore
		this.couleurTexte.next(sessionStorage.getItem("textColor"));
	}

	lightOrDark(color: any) {

		// Variables for red, green, blue values
		let r, g, b, hsp;

		// If hex --> Convert it to RGB: http://gist.github.com/983661
		color = +("0x" + color.slice(1).replace(
			color.length < 5 && /./g, '$&$&'));

		r = color >> 16;
		g = color >> 8 & 255;
		b = color & 255;

		// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
		hsp = Math.sqrt(
			0.299 * (r * r) +
			0.587 * (g * g) +
			0.114 * (b * b)
		);

		// Using the HSP value, determine whether the color is light or dark
		if (hsp>127.5) {

			return 'light';
		}
		else {

			return 'dark';
		}
	}

	isAdmin():boolean{
		return this.getDroits() === 'admin';
	}

	isDelegue():boolean{
	  	return this.getDroits() === 'délégué' || this.isAdmin();
	}

	isPublicateur():boolean{
		return this.getDroits() === 'publicateur' || this.isDelegue();
	}
}
