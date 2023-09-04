import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { ReinitialiserPasswordComponent } from './reinitialiser-password/reinitialiser-password.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { GagnantComponent } from './gagnant/gagnant.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { CampagneComponent } from './campagne/campagne.component';
import { ListeCampagneComponent } from './campagne/liste-campagne/liste-campagne.component';
import { GererGagnantComponent } from './campagne/gerer-gagnant/gerer-gagnant.component';
import { VisualisationMediaComponent } from './visualisation-media/visualisation-media.component';
import { SafePipe } from '../safe-pipe';
import { FacebookModule } from 'ngx-facebook';
import { PublicationComponent } from './publication/publication.component';
import { CampagnePublicationComponent } from './publication/campagne-publication/campagne-publication.component';
import { SharedService } from '../services/shared.service';
import { NouvellePublicationComponent } from './publication/nouvelle-publication/nouvelle-publication.component';
import { NouvelleCampagneComponent } from './campagne/nouvelle-campagne/nouvelle-campagne.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChoisirGagnantComponent } from './campagne/choisir-gagnant/choisir-gagnant.component';

@NgModule({
  declarations: [
    SafePipe,
    BackOfficeComponent,
    ReinitialiserPasswordComponent,
    MonCompteComponent,
    MessagerieComponent,
    GagnantComponent,
    UserManageComponent,
    CampagneComponent,
    ListeCampagneComponent,
    GererGagnantComponent,
    VisualisationMediaComponent,
    PublicationComponent,
    CampagnePublicationComponent,
    NouvellePublicationComponent,
    NouvelleCampagneComponent,
    ChoisirGagnantComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    NgSelectModule,

    FacebookModule.forRoot(),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BackOfficeModule { }
