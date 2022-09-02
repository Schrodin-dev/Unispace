import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from "../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {RequestsService} from "../services/requests.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
	@ViewChild("#mobileMenu") scrollTarget: ElementRef | undefined;

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
      rootPath: "/adminDelegue",
      childs: [
        {
          path: "admin/gestionEtudiants",
          name: "Gestion Étudiants"
        },
        {
          path: "admin/annonce",
          name: "Faire une annonce"
        }
      ]
    },
	  {
		  rootPath: "/admin",
		  childs: [
			  {
				  path: "admin/gestionEtudiants",
				  name: "Gestion Étudiants"
			  },
			  {
				  path: "admin/gestionUERessources",
				  name: "Gestion U.E./Ressources",
			  },
			  {
				  path: "admin/gestionGroupes",
				  name: "Gestion groupes",
			  },
			  {
				  path: "admin/gestionThemes",
				  name: "Gestion thèmes",
			  },
			  {
				  path: "admin/annonce",
				  name: "Faire une annonce"
			  }
		  ]
	  }
  ];
  currentSubmenuRoutes:any;
  currentRootPath!: String;
  couleurPrincipale!: String;
  isOpenMenu!: boolean;
	isDelegue!: boolean;

  constructor(private authService: AuthService, private router: Router, private requestService: RequestsService) {
    router.events.subscribe((url:any) => {
		this.isOpenMenu = false;

      if(authService.isLogin()){
        this.usersInfos = authService.getUserInfos();
		this.isDelegue = this.authService.isDelegue();
      }

      if(url instanceof NavigationEnd){
        this.path = '/' + router.url.split('/')[1];
		if(this.currentRootPath === this.path) return;
        for(let routes of this.submenuRoutes){
          if(this.path === routes.rootPath || (this.path + 'Delegue' === routes.rootPath && this.authService.isDelegue() && !this.authService.isAdmin())){
			  this.currentRootPath = routes.rootPath;
            this.currentSubmenuRoutes = routes.childs;
			return;
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

  onMenuBurger(){
	  this.isOpenMenu = !this.isOpenMenu;
  }
}
