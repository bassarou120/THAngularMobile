import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Campagne } from '../models/campagne';
import { Messagerie } from '../models/messagerie';
import { User } from '../models/user';
import { CampagneService } from '../services/campagne.service';
import { MessagerieService } from '../services/messagerie.service';
import { SharedService } from '../services/shared.service';
import { TokenStorage } from '../services/token.storage';


@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent implements OnInit {

  nbreMessage = 0;
  nbreCampagneEnCours = 0;

  i = 0;
  userToken: string | null = '';
  user: User = new User();

  constructor(
    private tokenStorage: TokenStorage,
    private router: Router,
    private sharedService: SharedService,
    private messagerieService: MessagerieService,
    private campagneService: CampagneService,
  ) { }

  ngOnInit(): void {
    //this.userToken = this.tokenStorage.getToken();
    //this.user = JSON.parse(this.tokenStorage.getToken()  || '{}');
    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = Object.keys(data).length > 0 ? data : null;
        if(this.user != null) {
          this.messagerieService
          .getMessageriesListByUser(this.user.id)
          .pipe(take(1))
          .subscribe((res: Messagerie[]): void => {
            const result = res.filter(element => element.postedBy.id != this.user.id && element.status == 'Important');
            this.nbreMessage = result.length;
          });

          this.campagneService
              .getCampagnesListSentForUser(this.user.id)
              .pipe(take(1))
              .subscribe((res: Campagne[]): void => {
                const result = res.filter(element => element.status == 'EN COURS');
                this.nbreCampagneEnCours = result.length;
              });
        }
      }
    });
  }

  deconnexion(): void {
    //this.tokenStorage.signOut();
    this.sharedService.setUser({});
    this.router.navigate(['/']);
  }

}


