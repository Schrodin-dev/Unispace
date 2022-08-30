import {Note} from "./note.model";

export class Ressource{
	nom!: String;
	moyenne!: number;
	notes!: Note[];
	id!: number;

	constructor(nom: String, moyenne: number, id: number) {
		this.nom = nom;
		this.moyenne = moyenne;
		this.notes = [];
		this.id = id;
	}

	addNote(note: Note){
		this.notes.push(note);
	}
}
