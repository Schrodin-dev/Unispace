import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import backend from "../../assets/config/backend.json";
import {Cours} from "../models/cours.model";
import {TravailAFaire} from "../models/travailAFaire.model";
import {Note} from "../models/note.model";
import {UE} from "../models/UE.model";
import {Ressource} from "../models/ressource.model";
import {AuthService} from "./auth.service";

@Injectable()
export class RequestsService{

  constructor(private httpClient: HttpClient, private authService: AuthService) {

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

			  planning.sort((a, b) => {
				  return a.debut.getTime() - b.debut.getTime();
			  });

			  for(let i = 1; i < planning.length; i++){
				  if(planning[i].debut.getDate() === planning[i - 1].fin.getDate()){
					  planning[i].setEcart((planning[i].debut.getTime()/60000 - planning[i - 1].fin.getTime()/60000)/15);
				  }
			  }

			  return planning;
		  });
  }

  getTravailAFaireEmbed(): Promise<TravailAFaire[]>{
	  return this.httpClient.post(backend.url + "/api/travailAFaire/afficherEmbed",{})
		  .toPromise()
		  .then(listeTravails => {
			  let travails: TravailAFaire[] = [];
			  // @ts-ignore
			  for(let travail of listeTravails){
				  let travailAFaire = new TravailAFaire(travail.idTravailAFaire, travail.dateTravailAFaire, travail.descTravailAFaire, travail.nomCours, travail.cour.couleurCours)
				  travailAFaire.setEstNote(travail.estNote);
				  travails.push(travailAFaire);
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

  getDetailNotes(): Promise<{UE: UE[], ressources: Ressource[]}>{
	  return this.httpClient.get(backend.url + '/api/notation/detail')
		  .toPromise()
		  .then(res => {
			  let result: { UE: UE[]; ressources: Ressource[] };
			  result = {
				  UE: [],
				  ressources: []
			  };

			  // @ts-ignore
			  for(let UETemp of res.UE){
				  result.UE.push(new UE(UETemp.nom, UETemp.moyenne));
			  }

			  // @ts-ignore
			  for(let ressourceTemp of res.ressources){
				  let ressource = new Ressource(ressourceTemp.nom, ressourceTemp.moyenne, ressourceTemp.id);

				  for(let noteTemp of ressourceTemp.devoirs){
					  let note = new Note(noteTemp.note, noteTemp.bareme, noteTemp.nom);
					  note.setId(noteTemp.id);
					  note.setCoeff(noteTemp.coeff);
					  note.setGroupes(noteTemp.groupes);
					  ressource.addNote(note);
				  }

				  result.ressources.push(ressource);
			  }

			  return result;
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

	getAccepteRecevoirAnnonces(): Promise<boolean>{
		return this.httpClient.get(backend.url + '/api/auth/accepteAnnonces')
			.toPromise()
			.then(value => {
				// @ts-ignore
				return value.accepteRecevoirAnnonces;
			});
	}

	modifierUserInfos(email: String, nom: String, prenom:String, mdp: String, groupe: String, annonces: boolean): Promise<String>{
		return this.httpClient.post(backend.url + '/api/auth/modify', {
			email: email,
			nom: nom,
			prenom: prenom,
			password: mdp,
			groupe: groupe,
			annonces: annonces
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerCompte(): Promise<String>{
		return this.httpClient.post(backend.url + '/api/auth/remove', {})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	recupererThemes(): Promise<number[]>{
		return this.httpClient.get(backend.url + '/api/auth/themes', {})
			.toPromise()
			.then(themes => {
				let idThemes: number[] = [];

				// @ts-ignore
				for(const theme of themes){
					idThemes.push(theme.idTheme);
				}

				return idThemes;
			});
	}

	modifierTheme(theme: number): Promise<String>{
		return this.httpClient.post(backend.url + '/api/auth/modifierTheme', {
			theme: theme
		})
			.toPromise()
			.then(value => {
				// @ts-ignore
				this.authService.updateTheme(value.theme.couleurPrincipaleTheme, value.theme.couleurFond, value.theme.sourceTheme, value.theme.idTheme);

				// @ts-ignore
				return value.message;
			});
	}
}
