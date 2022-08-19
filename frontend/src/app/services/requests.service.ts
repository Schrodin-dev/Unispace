import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Observable, Subject} from "rxjs";
import backend from "../../assets/config/backend.json";
import {Cours} from "../models/cours.model";
import {travailAFaire} from "../models/travailAFaire.model";
import {Note} from "../models/note.model";

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

  getCours(debut: String, fin: String): Promise<Cours[]>{
	  return this.httpClient.post(backend.url + "/api/groupe/recupererEdt", {
		  debut: debut,
		  fin: fin
	  }, RequestsService.getRequestOptions())
		  .toPromise()
		  .then(edt => {
			  let planning: Cours[] = [];
			  let i = 0;
			  // @ts-ignore
			  for (let cours of edt) {
				  planning[i] = new Cours(cours.nom, cours.debut, cours.fin, cours.profs, cours.couleur, cours.salles);
				  i++;
			  }

			  planning.sort((a, b) => {
				  return a.debut.getTime() - b.debut.getTime();
			  });

			  return planning;
		  });
  }

  async getTravailAFaireEmbed(){
	  let travails: travailAFaire[] = [];

	  await this.httpClient.post(backend.url + "/api/travailAFaire/afficherEmbed",{}, RequestsService.getRequestOptions())
		  .subscribe(listeTravails => {
			  let i = 0;
			  // @ts-ignore
			  for(let travail of listeTravails){
				  travails[i] = new travailAFaire(travail.idTravailAFaire, travail.dateTravailAFaire, travail.descTravailAFaire, travail.estNote, travail.nomCours, travail.cour.couleurCours);
				  i++;
			  }

			  travails.sort((a, b) => {return a.date.getTime() - b.date.getTime()});
		  })

	  return travails;
  }

  async getNoteEmbed(){
	  let notes: Note[] = [];

	  await this.httpClient.get(backend.url + "/api/notation/dernieresNotes", RequestsService.getRequestOptions())
		  .subscribe(listeNotes => {
			  let i = 0;
			  // @ts-ignore
			  for(let note of listeNotes){
				  notes[i] = new Note(note.noteDevoir, note.devoir.noteMaxDevoir, note.createdAt, note.devoir.nomDevoir);
				  i++;
			  }

			  notes.sort((a, b) => {return a.date.getTime() - b.date.getTime()});
		  })

	  return notes;
  }

}
