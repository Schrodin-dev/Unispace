import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {RequestsService} from "../services/requests.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  usersInfos = this.authService.getUserInfos();
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
          path: "notes/detail",
          name: "Mes notes"
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
    },
    {
      rootPath: "/admin",
      childs: [
        {
          path: "admin/gestionClasse",
          name: "Gestion Classe"
        },
        {
          path: "admin/gestionUE",
          name: "Gestion U.E."
        },
        {
          path: "admin/annonce",
          name: "Faire une annonce"
        }
      ]
    }
  ];
  currentSubmenuRoutes:any;
  couleurPrincipale!: String;

  constructor(private authService: AuthService, private router: Router, private requestService: RequestsService) {
    router.events.subscribe((url:any) => {
      if(authService.isLogin()){
        this.usersInfos = authService.getUserInfos();
      }

      if(url instanceof NavigationEnd){
        console.log(router.url);
        this.path = router.url;
        for(let routes of this.submenuRoutes){
          if(routes.rootPath === this.path){
            this.currentSubmenuRoutes = routes.childs;
          }
        }
      }
    });
  }

  ngOnInit(): void {
	  this.authService.couleurPrincipale.subscribe(couleur => {
		  this.couleurPrincipale = couleur;
	  })
  }

  disconnect(){
    this.authService.disconnect();
  }
}
