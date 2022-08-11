import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Observable, Subject} from "rxjs";
import backend from "../../assets/config/backend.json";
import {Cours} from "../models/cours.model";

@Injectable()
export class RequestsService{
  userInfosContent:any;

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

	private static getRequestOptions(): { headers: HttpHeaders }{
		let headers =  new HttpHeaders();
		headers = headers.append('Content-Type', 'application/json; charset=utf-8');
		headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem("token"));
		return { headers: headers };
	}

  getClasses(): Observable<any>{
	  return this.httpClient.get(backend.url + "/api/auth/visualiserClasses");
  }

  async getCours(debut: String, fin: String)/*: Observable<any>*/{
	  let planning: Cours[] = []
	  await this.httpClient.post(backend.url + "/api/groupe/recupererEdt",{
		  debut: debut,
		  fin: fin
	  }, RequestsService.getRequestOptions())
		  .subscribe(edt => {
			  let i = 0;
			  // @ts-ignore
			  for(let cours of edt){
				  planning[i] = new Cours(cours.nom, cours.debut, cours.fin, cours.profs, cours.couleur, cours.salles);
				  i++;
			  }

			  planning.sort((a, b) => {return a.debut.getTime() - b.debut.getTime()});
		  })


	  return planning;
  }

}
