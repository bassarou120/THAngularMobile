import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';





// Import Firebase modules + environment
import {getApp, provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {initializeAuth, provideAuth, getAuth , indexedDBLocalPersistence} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { TokenStorage } from './services/token.storage';
import { WINDOW_PROVIDERS } from './services/window';
import { AuthGuard } from './services/auth-guard';
import { SharedService } from './services/shared.service';
import { FacebookModule } from 'ngx-facebook';
import {Capacitor} from "@capacitor/core";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    // provideAuth(() => getAuth()),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(),
          {
          persistence: indexedDBLocalPersistence
        })
      } else
        {

        return getAuth()
      }
    }),
    // AngularFireModule.initializeApp(environment.firebaseConfig),

    FacebookModule.forRoot(),

  ],
  providers: [
    WINDOW_PROVIDERS,
    TokenStorage,
    SharedService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
