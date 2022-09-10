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
import {Doc} from "../models/doc.model";
import {User} from "../models/user.model";
import {RessourceAdmin} from "../models/ressourceAdmin.model";
import {UEAdmin} from "../models/UEAdmin.model";
import {LienRessourceUE} from "../models/lienRessourceUE.model";
import {Theme} from "../models/theme.model";

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

	chargerListeCours():Promise<{nom: String, couleur: String}[]>{
		return this.httpClient.get(backend.url + '/api/groupe/listeCours', {})
			.toPromise()
			.then(listeCoursTemp => {
				let listeCours: {nom: String, couleur:String}[] = [];

				// @ts-ignore
				for(const cours of listeCoursTemp){
					listeCours.push({
						nom: cours.nom,
						couleur: cours.couleur
					})
				}

				return listeCours;
			});
	}

	chargerPageTravailAFaire(dateMin: Date, pagination: number, cours: String): Promise<TravailAFaire[]>{
		return this.httpClient.post(backend.url + '/api/travailAFaire/afficher', {
			dateMin: dateMin,
			pagination: pagination,
			cours: cours
		})
			.toPromise()
			.then(value => {
				let travails: TravailAFaire[] = [];

				// @ts-ignore
				for(let t of value){
					let travail = new TravailAFaire(t.idTravailAFaire, t.dateTravailAFaire, t.descTravailAFaire, t.nomCours, t.cour.couleurCours);
					travail.setEstNote(t.estNote);
					for(let doc of t.docsTravailARendres){
						travail.ajouterDocument(new Doc(doc.idDoc, doc.nomDoc, doc.lienDoc));
					}
					for(let groupe of t.groupes){
						travail.ajouterGroupe(groupe.nomGroupe);
					}
					travails.push(travail);
				}

				return travails.sort((a, b) => {return a.date.getTime() - b.date.getTime()});
			});
	}

	chargerPageContenuCours(dateMin: Date, pagination: number, cours: String): Promise<TravailAFaire[]>{
		return this.httpClient.post(backend.url + '/api/contenuCours/afficher', {
			dateMin: dateMin,
			pagination: pagination,
			cours: cours
		})
			.toPromise()
			.then(value => {
				let travails: TravailAFaire[] = [];

				// @ts-ignore
				for(let t of value){
					let travail = new TravailAFaire(t.idContenuCours, t.dateContenuCours, t.descContenuCours, t.nomCours, t.cour.couleurCours);
					for(let doc of t.docsContenuCours){
						travail.ajouterDocument(new Doc(doc.idDoc, doc.nomDoc, doc.lienDoc));
					}
					for(let groupe of t.groupes){
						travail.ajouterGroupe(groupe.nomGroupe);
					}
					travails.push(travail);
				}

				return travails.sort((a, b) => {return a.date.getTime() - b.date.getTime()});
			});
	}

	ajouterContenuCours(date: Date, desc: String, groupes: String[], cours: String, docs: Doc[]):Promise<String>{
	  	let documents: {nom: String, lienDoc: String}[] = [];
		  for(let doc of docs){
			  documents.push({
				  nom: doc.nom,
				  lienDoc: doc.lien
			  });
		  }

	  	return this.httpClient.post(backend.url + '/api/contenuCours/ajouter', {
			date: date,
			description: desc,
			groupes: groupes,
			cours: cours,
			documents: documents
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierContenuCours(id:number, date: Date, desc: String, groupes: String[], cours: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/contenuCours/modifier', {
			contenuCours: id,
			date: date,
			description: desc,
			cours: cours,
			groupes: groupes
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerContenuCours(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/contenuCours/supprimer', {
			contenuCours: id
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterDocumentContenuCours(contenu: number, nom: String, lien: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/contenuCours/document/ajouter', {
			contenuCours: contenu,
			nom: nom,
			lienDoc: lien
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierDocumentContenuCours(id: number, nom: String, lien: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/contenuCours/document/modifier', {
			doc: id,
			nom: nom,
			lienDoc: lien
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerDocumentContenuCours(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/contenuCours/document/supprimer', {
			doc: id,
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterTravailAFaire(date: Date, desc: String, estNote: boolean, groupes: String[], cours: String, docs: Doc[]):Promise<String>{
		let documents: {nom: String, lienDoc: String}[] = [];
		for(let doc of docs){
			documents.push({
				nom: doc.nom,
				lienDoc: doc.lien
			});
		}

		return this.httpClient.post(backend.url + '/api/travailAFaire/ajouter', {
			date: date,
			description: desc,
			estNote: estNote,
			groupes: groupes,
			cours: cours,
			documents: documents
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierTravailAFaire(id:number, date: Date, desc: String, estNote: boolean, groupes: String[], cours: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/travailAFaire/modifier', {
			travailAFaire: id,
			date: date,
			description: desc,
			estNote: estNote,
			cours: cours,
			groupes: groupes
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerTravailAFaire(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/travailAFaire/supprimer', {
			travailAFaire: id
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterDocumentTravailAFaire(travail: number, nom: String, lien: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/travailAFaire/document/ajouter', {
			travailAFaire: travail,
			nom: nom,
			lienDoc: lien
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierDocumentTravailAFaire(id: number, nom: String, lien: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/travailAFaire/document/modifier', {
			doc: id,
			nom: nom,
			lienDoc: lien
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerDocumentTravailAFaire(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/travailAFaire/document/supprimer', {
			doc: id,
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	afficherUtilisateur():Promise<User[]>{
	  return this.httpClient.get(backend.url + '/api/auth/afficher').toPromise()
		  .then(users => {
			  let listeUsers: User[] = [];

			  // @ts-ignore
			  for(let u of users){
				  listeUsers.push(new User(u.droitsUser, u.emailUser, u.nomUser, u.prenomUser, u.nomGroupe));
			  }

			  return listeUsers;
		  })
	}

	modifierDroits(email: string, nouveauRole: string): Promise<String>{
		return this.httpClient.post(backend.url + '/api/auth/modifierDroits', {
			user: email,
			droits: nouveauRole
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	getListeParcours():Promise<String[]>{
		return this.httpClient.get(backend.url + '/api/notation/ressourceUE/listeParcours').toPromise()
			.then(parcours => {
				let listeParcours: String[] = [];

				// @ts-ignore
				for(let p of parcours){
					listeParcours.push(p.nomParcours);
				}

				return listeParcours;
			})
	}

	afficherRessourcesUE(parcours: String):Promise<{ressources: RessourceAdmin[], UE: UEAdmin[], liens: LienRessourceUE[]}>{
		return this.httpClient.post(backend.url + '/api/notation/ressourceUE/afficher', {
			parcours: parcours
		})
			.toPromise()
			.then(objet => {
				let res: {ressources: RessourceAdmin[], UE: UEAdmin[], liens: LienRessourceUE[]} = {
					ressources: [],
					UE: [],
					liens: []
				};

				// @ts-ignore
				for(let ressource of objet.ressources){
					res.ressources.push(new RessourceAdmin(ressource.id, ressource.nom));
				}

				// @ts-ignore
				for(let ue of objet.UE){
					res.UE.push(new UEAdmin(ue.id, ue.nom));
				}

				// @ts-ignore
				for(let lien of objet.coeffs){
					res.liens.push(new LienRessourceUE(lien.ressource, lien.UE, lien.coeff));
				}

				return res;
			});
	}

	ajouterUE(nom: String, numeroUE: number, parcours: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/UE/ajouter', {
			nom: nom,
			numeroUE: numeroUE,
			parcours: parcours
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerUE(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/UE/supprimer', {
			UE: id
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterRessource(nom: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/ressource/ajouter', {
			nom: nom
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerRessource(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/ressource/supprimer', {
			ressource: id
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	lierRessourceUE(idUE: number, idRessource: number, coeff: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/ressourceUE/lier', {
			UE: idUE,
			ressource: idRessource,
			coeff: coeff
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierLienRessourceUE(idUE: number, idRessource: number, coeff: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/ressourceUE/modifierCoeff', {
			UE: idUE,
			ressource: idRessource,
			coeff: coeff
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerLienRessourceUE(idUE: number, idRessource: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/ressourceUE/supprimer', {
			UE: idUE,
			ressource: idRessource
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	getDetailGroupes(): Promise<{anneeUniv: String, classes: {classe: String, groupes: String[]}[]}[]>{
		return this.httpClient.get(backend.url + '/api/groupe/detailGroupes')
			.toPromise()
			.then(detail => {
				let res: {anneeUniv: String, classes: {classe: String, groupes: String[]}[]}[] = [];

				// @ts-ignore
				for(let a of detail){
					let anneeUniv = {
						anneeUniv: a.nomAnneeUniv,
						classes: []
					};

					for(let c of a.classes){
						let classe = {
							classe: c.nomClasse,
							groupes: []
						};

						for(let g of c.groupes){
							// @ts-ignore
							classe.groupes.push(g.nomGroupe);
						}

						// @ts-ignore
						anneeUniv.classes.push(classe);
					}

					// @ts-ignore
					res.push(anneeUniv);
				}

				return res;
			});
	}

	ajouterAnneeUniv(nom: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/anneeUniv/ajouter', {
			nom: nom
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterClasse(nom: String, anneeUniv: String, parcours: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/classe/ajouter', {
			nomClasse: nom,
			anneeUniv: anneeUniv,
			nomParcours: parcours
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	ajouterGroupe(nom: String, lien: String, classe: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/groupe/ajouter', {
			nom: nom,
			lienICal: lien,
			classe: classe
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerAnneeUniv(anneeUniv: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/anneeUniv/supprimer', {
			anneeUniv: anneeUniv
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerClasse(classe: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/classe/supprimer', {
			classe: classe
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerGroupe(groupe: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/groupe/supprimer', {
			groupe: groupe
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	modifierLienICal(nom: String, lien: String): Promise<String>{
	  return this.httpClient.post(backend.url + '/api/groupe/modifierICal', {
		  nom: nom,
		  lienICal: lien
	  })
		  .toPromise()
		  .then(message => {
			  // @ts-ignore
			  return message.message;
		  });
	}

	afficherThemesAdmin(): Promise<Theme[]>{
		return this.httpClient.get(backend.url + '/api/auth/themesAdmin')
			.toPromise()
			.then(themes => {
				// @ts-ignore
				let listeThemes:Theme[] = [];

				// @ts-ignore
				for(let theme of themes){
					listeThemes.push(new Theme(theme.idTheme, theme.sourceTheme, theme.couleurPrincipaleTheme, theme.couleurFond));
				}

				return listeThemes;
			});
	}

	ajouterTheme(source: String, couleurPrincipale: String, couleurFond: String):Promise<String>{
		return this.httpClient.post(backend.url + '/api/auth/ajouterTheme', {
			source: source,
			couleurPrincipale: couleurPrincipale,
			couleurFond: couleurFond
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerTheme(id: number):Promise<String>{
		return this.httpClient.post(backend.url + '/api/auth/supprimerTheme', {
			theme: id
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	chargerDestinatairesAnnonces(): Promise<String[]>{
		return this.httpClient.get(backend.url + '/api/mail/destinataires')
			.toPromise()
			.then(destinataires => {
				let liste: String[] = [];

				// @ts-ignore
				for(let dest of destinataires){
					liste.push(dest);
				}

				return liste;
			});
	}

	envoyerAnnonce(destinataires: String, sujet: String, contenu: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/mail/annonce', {
			destinataires: destinataires,
			subject: sujet,
			contenu: contenu
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	listeParcours(): Promise<String[]>{
		return this.httpClient.get(backend.url + '/api/notation/parcours/afficher')
			.toPromise()
			.then(liste => {
				let parcours: String[] = [];

				// @ts-ignore
				for(let p of liste){
					parcours.push(p.nomParcours);
				}

				return parcours;
			});
	}

	ajouterParcours(nom: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/parcours/ajouter', {
			nomParcours: nom
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}

	supprimerParcours(nom: String): Promise<String>{
		return this.httpClient.post(backend.url + '/api/notation/parcours/supprimer', {
			parcours: nom
		})
			.toPromise()
			.then(message => {
				// @ts-ignore
				return message.message;
			});
	}
}
