export class Cours{
	nom!: String;
	debut!: Date;
	fin!: Date;
	profs!: String[];
	couleur!: String;
	salles!: String;
	ecartCourtPrecedant!: number //en x15 minutes

	constructor(nom: String, debut: string, fin: string, profs: String[], couleur: String, salles: String) {
		this.nom = nom;
		this.debut = new Date(debut);
		this.fin = new Date(fin);
		this.profs = profs;
		this.couleur = couleur;
		this.salles = salles
	}

	setEcart(ecart: number){
		if(ecart <= 1){
			this.ecartCourtPrecedant = 0;
		}else if(ecart >= 11){
			this.ecartCourtPrecedant = 10;
		}else{
			this.ecartCourtPrecedant = ecart - 1;
		}
	}
}
