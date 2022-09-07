export class Theme{
	id!: number;
	source!: String;
	couleurPrincipale!: String;
	couleurFond!: String;


	constructor(id: number, source: String, couleurPrincipale: String, couleurFond: String) {
		this.id = id;
		this.source = source;
		this.couleurPrincipale = couleurPrincipale;
		this.couleurFond = couleurFond;
	}
}
