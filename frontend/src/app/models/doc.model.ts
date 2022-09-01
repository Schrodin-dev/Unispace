export class Doc{
	id!: String;
	nom!: String;
	lien!: String;

	constructor(id: String, nom: String, lien: String) {
		this.id = id;
		this.nom = nom;
		this.lien = lien;
	}

	estComplet():boolean{
		return this.nom !== undefined && this.lien !== undefined && this.nom.length > 0 && this.lien.length > 0;
	}


}
