import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  {
    path: 'back-office',
    loadChildren: () => import('./back-office/back-office.module').then(value => value.BackOfficeModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(value => value.HomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
