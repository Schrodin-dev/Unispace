import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.component.html',
  styleUrls: ['./erreur.component.scss']
})
export class ErreurComponent implements OnInit {
	@Input() message!: String;
	@Output() close = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  //https://stackoverflow.com/questions/39764546/can-component-invoke-a-self-destroy-event
  emitClose(){
	  this.close.emit(true);
  }

}
