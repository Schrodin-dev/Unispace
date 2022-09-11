import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import backend from "../../assets/config/backend.json";
import {BehaviorSubject, Observable, ObservableInput, Subject, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable()
export class AuthService{
  private loginRes:any;
	public couleurPrincipale: Subject<String> = new BehaviorSubject<String>(localStorage.getItem("couleurPrincipale") || 'AD1FB7');
	public couleurFond: Subject<String> = new BehaviorSubject<String>(localStorage.getItem("couleurFond") || 'ffffff');
	public sourceImageTheme: Subject<String> = new BehaviorSubject<String>(localStorage.getItem("sourceImageTheme") || 'une source');
	public theme: Subject<String> = new BehaviorSubject<String>(localStorage.getItem("theme") || '1');
	public couleurTexte: Subject<String> = new BehaviorSubject<String>(localStorage.getItem("textColor") || 'light');

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
			localStorage.setItem("email", email);
			localStorage.setItem("token", this.loginRes.token);
			localStorage.setItem("groupe", this.loginRes.groupe);
			localStorage.setItem("droits", this.loginRes.droits);
			localStorage.setItem("nom", this.loginRes.nom);
			localStorage.setItem("prenom", this.loginRes.prenom);

			this.updateTheme(this.loginRes.couleurPrincipale, this.loginRes.couleurFond, this.loginRes.sourceImageTheme, this.loginRes.theme)

			this.router.navigate(['']);

			return res;
		});
  }

  disconnect(){
	  localStorage.clear();
    this.router.navigate(['login']);
  }

  getEmail(){
    return localStorage.getItem("email");
  }

  getToken(){
    return localStorage.getItem("token");
  }

  isLogin(){
    return (localStorage.getItem("token") !== null);
  }

  getNom(){
    return localStorage.getItem("nom");
  }

  getPrenom(){
    return localStorage.getItem("prenom");
  }

  getGroupe(){
    return localStorage.getItem("groupe");
  }

  getDroits(){
    return localStorage.getItem("droits");
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
		localStorage.setItem("couleurPrincipale", couleurPrincipale);
		this.couleurFond.next(couleurFond);
		localStorage.setItem("couleurFond", couleurFond);
		this.sourceImageTheme.next(source);
		localStorage.setItem("sourceImageTheme", source);
		this.theme.next(theme);
		localStorage.setItem("theme", theme);

		localStorage.setItem("textColor", this.lightOrDark(couleurFond));
		// @ts-ignore
		this.couleurTexte.next(localStorage.getItem("textColor"));
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
