export class Cours{
	nom!: String;
	debut!: Date;
	fin!: Date;
	profs!: String[];
	couleur!: String;
	salles!: String;

	constructor(nom: String, debut: string, fin: string, profs: String[], couleur: String, salles: String) {
		this.nom = nom;
		this.debut = new Date(debut);
		this.fin = new Date(fin);
		this.profs = profs;
		this.couleur = couleur;
		this.salles = salles
	}
}
