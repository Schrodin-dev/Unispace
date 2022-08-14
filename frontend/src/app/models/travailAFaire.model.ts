export class travailAFaire{
	id!: String;
	date!: Date;
	desc!: String;
	estNote!: boolean;
	nomCours!: String;
	couleurCours!: String;

	constructor(id: String, date: String, desc: String, estNote: boolean, nomCours: String, couleurCours: String) {
		this.id = id;
		// @ts-ignore
		this.date = new Date(date);
		this.desc = desc;
		this.estNote = estNote;
		this.nomCours = nomCours;
		this.couleurCours = couleurCours;
		/* rajouter un constructeur avec les documents et un modèle pour les documents */
	}
}
