export class LienRessourceUE{
	idRessource!: number;
	idUE!: number;
	coeff!: number;


	constructor(idRessource: number, idUE: number, coeff: number) {
		this.idRessource = idRessource;
		this.idUE = idUE;
		this.coeff = coeff;
	}
}
