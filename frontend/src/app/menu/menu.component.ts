import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {RequestsService} from "../services/requests.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  auth:any;
  usersInfos = {
    nom: '',
    prenom: '',
    email: '',
    classe: '',
    groupe: ''
  };
  usersInfosSubscription: Subscription | undefined;
  path = "/";
  submenuRoutes = [
    {
      rootPath: "/",
      childs: [
        {
          path: "/",
          name: "Page d'accueil"
        }
      ]
    },
    {
      rootPath: "/params",
      childs: [
        {
          path: "/params",
          name: "Mes données"
        }
      ]
    },
    {
      rootPath: "/agenda",
      childs: [
        {
          path: "/agenda/content",
          name: "Contenu et ressoures"
        },
        {
          path: "/agenda/todo",
          name: "Travail à faire"
        }
      ]
    },
    {
      rootPath: "/notes",
      childs: [
        {
          path: "/detail",
          name: "Mes notes"
        },
        {
          path: "/graphes",
          name: "Graphes"
        }
      ]
    },
    {
      rootPath: "/edt",
      childs: [
        {
          path: "/edt",
          name: "Mon emploi du temps"
        }
      ]
    }
  ];
  currentSubmenuRoutes:any;

  constructor(private authService: AuthService, private router: Router, private requestService: RequestsService) {
    router.events.subscribe((url:any) => {
      if(url instanceof NavigationEnd){
        console.log(router.url);
        this.path = router.url;
        if(this.usersInfos.nom == ''){
          this.requestService.userInfos();
          this.usersInfosSubscription = this.requestService.userInfosContentSubject.subscribe(
            (res:any) => {
              this.usersInfos = res;
            }
          )
        }
        for(let routes of this.submenuRoutes){
          if(routes.rootPath === this.path){
            this.currentSubmenuRoutes = routes.childs;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.auth = this.authService;
    this.requestService.userInfos();
    this.usersInfosSubscription = this.requestService.userInfosContentSubject.subscribe(
      (res:any) => {
        this.usersInfos = res;
      }
    )


  }


}
