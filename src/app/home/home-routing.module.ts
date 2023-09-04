import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConditionUtilisationComponent } from './condition-utilisation/condition-utilisation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {RegisterIosComponent} from "./register-ios/register-ios.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-ios', component: RegisterIosComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'condition-utilisation', component: ConditionUtilisationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
