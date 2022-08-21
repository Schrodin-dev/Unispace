export class Note{
	note!: number;
	bareme!: number;
	date!: Date;
	nomDevoir!: String;


	constructor(note: number, bareme: number, date: string, nomDevoir: String) {
		this.note = note;
		this.bareme = bareme;
		this.date = new Date(date);
		this.nomDevoir = nomDevoir;
	}
}
