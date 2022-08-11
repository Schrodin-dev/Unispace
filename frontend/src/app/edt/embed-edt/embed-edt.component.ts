import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-embed-edt',
  templateUrl: './embed-edt.component.html',
  styleUrls: ['./embed-edt.component.scss']
})
export class EmbedEdtComponent implements OnInit {

	dateSelectionnee!: FormGroup;
	edt: any;

  constructor(private formBuilder: FormBuilder, private requests: RequestsService) { }

  ngOnInit(): void {
		this.dateSelectionnee = this.formBuilder.group({
			date: [new Date().toISOString().substr(0, 10)]
		});


		this.dateSelectionnee.valueChanges.forEach(newValue => {
			this.edt = this.requests.getCours(newValue.date, newValue.date);
		})
  }


}
