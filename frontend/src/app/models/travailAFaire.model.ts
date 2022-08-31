export class TravailAFaire {
	id!: String;
	date!: Date;
	desc!: String;
	estNote!: boolean;
	nomCours!: String;
	couleurCours!: String;
	documents!: String[];

	constructor(id: String, date: string, desc: String, nomCours: String, couleurCours: String) {
		this.id = id;
		this.date = new Date(date);
		this.desc = desc;
		this.nomCours = nomCours;
		this.couleurCours = couleurCours;
		this.documents = [];
	}

	ajouterDocument(lien: String){
		this.documents.push(lien);
	}

	setEstNote(estNote: boolean){
		this.estNote = estNote;
	}
}
