import {Doc} from "./doc.model";

export class TravailAFaire {
	id!: String;
	date!: Date;
	desc!: String;
	estNote!: boolean;
	nomCours!: String;
	couleurCours!: String;
	documents!: Doc[];
	groupes!: String[];

	constructor(id: String, date: string, desc: String, nomCours: String, couleurCours: String) {
		this.id = id;
		this.date = new Date(date);
		this.desc = desc;
		this.nomCours = nomCours;
		this.couleurCours = couleurCours;
		this.documents = [];
		this.groupes = [];
	}

	ajouterDocument(doc: Doc){
		this.documents.push(doc);
	}

	setEstNote(estNote: boolean){
		this.estNote = estNote;
	}

	ajouterGroupe(groupe: String){
		this.groupes.push(groupe);
	}
}
