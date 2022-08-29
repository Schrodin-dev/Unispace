import {Ressource} from "./ressource.model";

export class UE{
	nom!: String;
	moyenne!: number;
	ressources!: Ressource[];

	constructor(nom: String, moyenne: number) {
		this.nom = nom;
		this.moyenne = moyenne;
		this.ressources = [];
	}

	addRessource(ressource: Ressource){
		this.ressources.push(ressource);
	}
}
