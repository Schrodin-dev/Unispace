import {Note} from "./note.model";

export class Ressource{
	nom!: String;
	moyenne!: number;
	notes!: Note[];

	constructor(nom: String, moyenne: number) {
		this.nom = nom;
		this.moyenne = moyenne;
		this.notes = [];
	}

	addNote(note: Note){
		this.notes.push(note);
	}
}
