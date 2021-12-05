import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.scss']
})
export class RegisterComponentComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  onRegister(f: NgForm){
    this.authService.register(f.value.nom, f.value.prenom, f.value.email, f.value.password, f.value.classe, f.value.groupe);
  }
}
