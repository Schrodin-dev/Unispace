import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { EditAccountComponent } from './edit-account/edit-account.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MainPageComponent,
    FooterComponent,
    LoginPageComponent,
    EditAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
