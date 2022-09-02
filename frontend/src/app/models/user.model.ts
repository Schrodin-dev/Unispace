export class User{
	droits: string;
	email: string;
	nom: string;
	prenom: string;
	groupe: string;


	constructor(droits: string, email: string, nom: string, prenom: string, groupe: string) {
		this.droits = droits;
		this.email = email;
		this.nom = nom;
		this.prenom = prenom;
		this.groupe = groupe;
	}
}
