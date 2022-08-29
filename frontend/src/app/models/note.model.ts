export class Note{
	note!: number;
	bareme!: number;
	date!: Date;
	nomDevoir!: String;
	id!: number;

	constructor(note: number, bareme: number, nomDevoir: String) {
		this.note = note;
		this.bareme = bareme;
		this.nomDevoir = nomDevoir;
	}

	setDate(date: string): void{
		this.date = new Date(date);
	}

	setId(id: String){
		this.id = Number(id);
	}
}
