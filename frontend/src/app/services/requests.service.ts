import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import backend from "../../assets/config/backend.json";
import {Cours} from "../models/cours.model";
import {TravailAFaire} from "../models/travailAFaire.model";
import {Note} from "../models/note.model";

@Injectable()
export class RequestsService{

  constructor(private httpClient: HttpClient) {

  }

  getClasses(): Observable<any>{
	  return this.httpClient.get(backend.url + "/api/auth/visualiserClasses");
  }

  getCours(debut: String, fin: String): Promise<Cours[]>{
	  return this.httpClient.post(backend.url + "/api/groupe/recupererEdt", {
		  debut: debut,
		  fin: fin
	  })
		  .toPromise()
		  .then(edt => {
			  let planning: Cours[] = [];
			  // @ts-ignore
			  for (let cours of edt) {
				  planning.push(new Cours(cours.nom, cours.debut, cours.fin, cours.profs, cours.couleur, cours.salles));
			  }

			  return planning.sort((a, b) => {
				  return a.debut.getTime() - b.debut.getTime();
			  });
		  });
  }

  getTravailAFaireEmbed(): Promise<TravailAFaire[]>{
	  return this.httpClient.post(backend.url + "/api/travailAFaire/afficherEmbed",{})
		  .toPromise()
		  .then(listeTravails => {
			  let travails: TravailAFaire[] = [];
			  // @ts-ignore
			  for(let travail of listeTravails){
				  travails.push(new TravailAFaire(travail.idTravailAFaire, travail.dateTravailAFaire, travail.descTravailAFaire, travail.estNote, travail.nomCours, travail.cour.couleurCours));
			  }

			  return travails.sort((a, b) => {return a.date.getTime() - b.date.getTime()});
		  });
  }

  getNoteEmbed(): Promise<Note[]>{
	  return this.httpClient.get(backend.url + "/api/notation/dernieresNotes")
		  .toPromise()
		  .then(listeNotes => {
			  let notes: Note[] = [];
			  // @ts-ignore
			  for(let note of listeNotes){
				  notes.push(new Note(note.noteDevoir, note.devoir.noteMaxDevoir, note.createdAt, note.devoir.nomDevoir));
			  }

			  return notes.sort((a, b) => {return a.date.getTime() - b.date.getTime()});
		  });
  }

  verifierCompte(code: String): Promise<String>{
	  return this.httpClient.post(backend.url + '/api/auth/verify', {
		  codeVerification: code
	  })
		  .toPromise()
		  .then(message => {
			  // @ts-ignore
			  return message.message;
		  });
  }

  renvoyerCodeVerification(email: String): Promise<String>{
	  return this.httpClient.post(backend.url + '/api/auth/renvoyerCode', {
		  email: email
	  })
		  .toPromise()
		  .then(message => {
			  // @ts-ignore
			  return message.message;
		  });
  }

  changerPassword(code:String, mdp: String): Promise<String>{
	  return this.httpClient.post(backend.url + '/api/auth/changerMdp', {
		  codeVerification: code,
		  password: mdp
	  })
		  .toPromise()
		  .then(message => {
			  // @ts-ignore
			  return message.message;
		  });
  }
}
