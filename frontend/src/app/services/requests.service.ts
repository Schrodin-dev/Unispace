import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import backend from "../../assets/config/backend.json";
import {Cours} from "../models/cours.model";
import {TravailAFaire} from "../models/travailAFaire.model";
import {Note} from "../models/note.model";
import {UE} from "../models/UE.model";
import {Ressource} from "../models/ressource.model";

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
				  let n = new Note(note.noteDevoir, note.devoir.noteMaxDevoir, note.devoir.nomDevoir);
				  n.setDate(note.createdAt);
				  notes.push(n);
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

  getDetailNotes(): Promise<UE[]>{
	  return this.httpClient.get(backend.url + '/api/notation/detail')
		  .toPromise()
		  .then(res => {
			  let listeUE = [];

			  // @ts-ignore
			  for(let UETemp of res){
				  let ue = new UE(UETemp.nom, UETemp.moyenne);

				  for(let ressourceTemp of UETemp.ressources){
					  let ressource = new Ressource(ressourceTemp.nom, ressourceTemp.moyenne, ressourceTemp.id);

					  for(let noteTemp of ressourceTemp.devoirs){
						  let note = new Note(noteTemp.note, noteTemp.bareme, noteTemp.nom);
						  note.setId(noteTemp.id);
						  note.setCoeff(noteTemp.coeff);
						  note.setGroupes(noteTemp.groupes);
						  ressource.addNote(note);
					  }

					  ue.addRessource(ressource);
				  }

				  listeUE.push(ue);
			  }

			  return listeUE;
		  })
  }

  ajouterNote(idDevoir: Number, note: Number): Promise<String>{
	  return this.httpClient.post(backend.url + '/api/notation/note/ajouter', {
		  devoir: idDevoir,
		  note: note
	  })
		  .toPromise()
		  .then(message => {
			  // @ts-ignore
			  return message.message;
		  });
  }

	modifierNote(idDevoir: Number, note: Number): Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/note/modifier', {
			devoir: idDevoir,
			note: note
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierDevoir(id: Number, nom: String, coeff: String, noteMaxDevoir: Number, ressource: Number, groupes: String[]): Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/devoir/modifier', {
			devoir: id,
			nom: nom,
			coeff: coeff,
			noteMaxDevoir: noteMaxDevoir,
			ressource: ressource,
			groupes: groupes
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterDevoir(nom: String, coeff: String, noteMaxDevoir: Number, ressource: Number, groupes: String[]): Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/devoir/ajouter', {
			nom: nom,
			coeff: coeff,
			noteMaxDevoir: noteMaxDevoir,
			ressource: ressource,
			groupes: groupes
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerDevoir(id: Number): Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/devoir/supprimer', {
			devoir: id
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}
}
