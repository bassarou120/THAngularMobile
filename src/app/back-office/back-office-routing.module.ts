import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { CampagneComponent } from './campagne/campagne.component';
import { GererGagnantComponent } from './campagne/gerer-gagnant/gerer-gagnant.component';
import { ListeCampagneComponent } from './campagne/liste-campagne/liste-campagne.component';
import { NouvelleCampagneComponent } from './campagne/nouvelle-campagne/nouvelle-campagne.component';
import { GagnantComponent } from './gagnant/gagnant.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
import { CampagnePublicationComponent } from './publication/campagne-publication/campagne-publication.component';
import { NouvellePublicationComponent } from './publication/nouvelle-publication/nouvelle-publication.component';
import { PublicationComponent } from './publication/publication.component';
import { ReinitialiserPasswordComponent } from './reinitialiser-password/reinitialiser-password.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { VisualisationMediaComponent } from './visualisation-media/visualisation-media.component';
import { ChoisirGagnantComponent } from './campagne/choisir-gagnant/choisir-gagnant.component';

const routes: Routes = [
  {
    path: '', component: BackOfficeComponent,
    children: [
      /*{path: '', component: GagnantComponent},*/
      {path: '', component: PublicationComponent},
      {path: 'mon-compte/:id', component: MonCompteComponent},
      {path: 'update-profil/:id', component: MonCompteComponent},
      {path: 'gagnant', component: GagnantComponent},
      {path: 'messagerie', component: MessagerieComponent},
      {path: 'reinitialiser', component: ReinitialiserPasswordComponent},
      {path: 'utilisateurs', component: UserManageComponent},

      {path: 'campagnes', component: CampagneComponent},
      {path: 'campagnes/nouvelle-campagne', component: NouvelleCampagneComponent},
      {path: 'liste-campagne/:id', component: ListeCampagneComponent},
      {path: 'gerer-gagnant/:idcampagne', component: GererGagnantComponent},
      {path: 'choisir-gagnant/:idcampagne', component: ChoisirGagnantComponent},

      {path: 'campagne-publication/:idcampagne', component: CampagnePublicationComponent},
      {path: 'campagne-publication', component: CampagnePublicationComponent},
      {path: 'publication', component: PublicationComponent},
      {path: 'nouvelle-publication/:idcampagne', component: NouvellePublicationComponent},

      {path: 'visualisation/:i/:id', component: VisualisationMediaComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
