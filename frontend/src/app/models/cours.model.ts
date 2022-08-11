export class Cours{
	nom!: String;
	debut!: Date;
	fin!: Date;
	profs!: String[];
	couleur!: String;
	salles!: String;

	constructor(nom: String, debut: String, fin: String, profs: String[], couleur: String, salles: String) {
		this.nom = nom;
		// @ts-ignore
		this.debut = new Date(debut);
		// @ts-ignore
		this.fin = new Date(fin);
		this.profs = profs;
		this.couleur = couleur;
		this.salles = salles
	}
}
