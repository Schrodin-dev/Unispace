import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit{
  test:any;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

  }

  sendLogin() {
    // @ts-ignore
    this.httpClient
      .post('http://localhost:3000/users/login', {
        email: 'blabla@gmail.com',
        password: '1234'
      })
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log("error: " + error);
        }
        );
  }

  sendRegister(){
    this.httpClient
      .post('http://localhost:3000/users/register', {
        nom: 'Delaygues',
        prenom: 'Thélio',
        email: 'blabla@gmail.com',
        password: '1234',
        classe: "S3",
        groupe: 1
      })
    .subscribe(
      () => {
        console.log("register ok");
      },
    (error) => {
      console.log("error: " + error);
    }
    );
  }
}
