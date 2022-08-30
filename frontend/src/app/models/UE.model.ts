import {Ressource} from "./ressource.model";

export class UE{
	nom!: String;
	moyenne!: number;

	constructor(nom: String, moyenne: number) {
		this.nom = nom;
		this.moyenne = moyenne;
	}
}
