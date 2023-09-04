import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Campagne } from 'src/app/models/campagne';
import { CampagneService } from 'src/app/services/campagne.service';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Gagnant } from 'src/app/models/gagnant';
import { GagnantService } from 'src/app/services/gagnant.service';
import { Browser } from '@capacitor/browser';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-gerer-gagnant',
  templateUrl: './gerer-gagnant.component.html',
  styleUrls: ['./gerer-gagnant.component.css'],
})
export class GererGagnantComponent implements OnInit {
  isSearchingForm = false;
  searchValue: string = '';
  gagnantForm!: FormGroup;

  user: User = new User();

  idcampagne = '';
  oneCampagne: Campagne = new Campagne();
  isBusy = false;
  userList: User[] = [];
  userFilteredList: User[] = [];

  /*gagnantList: Gagnant[] = [];
  gagnantListFiltered: Gagnant[] = [];*/

  gagnantList: Post[] = [];
  gagnantListFiltered: Post[] = [];
  oneGagnant: any = null;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private campagneService: CampagneService,
    private gagnantService: GagnantService,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    //this.makeForm();
    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = data != '' ? data : null;
      }
    });
   /* this.userService
      .getUsersList()
      .pipe(take(1))
      .subscribe((res: User[]): void => {
        this.userList = res;
        console.log('res', res);
      });*/
    this.idcampagne = this.activeRoute.snapshot.params['idcampagne'];
    console.log(this.idcampagne);
    if (
      this.idcampagne != undefined &&
      this.idcampagne != '' &&
      this.idcampagne != null
    ) {
      this.campagneService
        .getCampagneByID(this.idcampagne)
        .pipe(take(1))
        .subscribe((data: any) => {
          console.log(data);
          this.oneCampagne = data;
          //this.makeForm();
        });

      this.list();
    }
  }

  list(): void {
    this.postService
      .getPostListByStatutAndCampagne('GAGNÉ', this.idcampagne)
      .pipe(take(1))
      .subscribe((data: any) => {
        console.log(data);
        this.gagnantList = data ? data : [];
        this.gagnantList.sort(function (a, b) {
          if (a.postedAt < b.postedAt) {
            return 1;
          }
          if (a.postedAt > b.postedAt) {
            return -1;
          }
          return 0;
        });
        this.gagnantListFiltered = this.gagnantList;
      });
  }

  selectItem(value: any): void {
    this.oneGagnant = value;
  }

  backToPrevious(): void {
    this.router.navigate(['/back-office/campagnes']);
  }

  choisirGagnant(): void {
    this.router.navigate(['/back-office/choisir-gagnant/'+this.oneCampagne.id]);
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  updatingPublication(): void {
    this.campagneService.updateNombreGagnantCampagne(
      this.idcampagne,
      -1
    );
  }

  /*deletedGagnant(gagnant: Gagnant): void {
    const i = this.gagnantList.findIndex(element => element.id === gagnant.id);
    const j = this.gagnantListFiltered.findIndex(element => element.id === gagnant.id);
    this.gagnantService.deleteGagnant(gagnant);
    this.campagneService.updateNombreGagnantCampagne(this.idcampagne, -1);
    this.gagnantList.splice(i, 1);
    this.gagnantListFiltered.splice(j, 1);
    this.toastr.success('Gagnant supprimé avec succès !');
    this.oneGagnant = new Gagnant();
  }

  makeForm(): void {
    this.gagnantForm = this.fb.group({
      idcampagne: [this.oneCampagne != null ? this.oneCampagne.id : null, [Validators.required]],
      titrecamapagne: [this.oneCampagne != null ? this.oneCampagne.title : null, [Validators.required]],
      mediaLink: ['', [Validators.required]],
      content: ['', [Validators.required]],
      user: [null, [Validators.required]],
      postedBy: [this.user && this.user.id ? this.user : null],
      mois: [(new Date().getMonth() + 1).toString()],
      annee: [new Date().getFullYear().toString()],
    });
  }

  selectUserValue(element: any): void {
    console.log(element?.value);
    const userSlected = this.userFilteredList.find((elt) => elt.id == element?.value);
    this.gagnantForm.get('user')?.setValue(userSlected);
    console.log(this.gagnantForm.value);
  }*/

  sendGagnant(): void {
    /* const formData = this.gagnantForm.value;
      this.isBusy = true;
      if (this.user && this.user.id) {
        if (this.gagnantForm.valid) {
          formData.postedBy = this.user;
          this.gagnantService.addGagnant(formData);
          this.campagneService.updateNombreGagnantCampagne(this.idcampagne, 1);
          this.toastr.success('Gagnant publié avec succès');
          //this.list();
          this.makeForm();
          this.isBusy = false;
        } else {
          this.toastr.error('Formulaire invalid');
          this.isBusy = false;
        }
      } else {
        this.toastr.error('Utilisateur inexistant');
        this.isBusy = false;
      }*/
  }

  filerData(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.gagnantListFiltered = [...this.gagnantList];
    }

    if (searchText) {
      const rows = this.gagnantList.filter(
        (d) =>
          d.content.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.postedBy.fullName.toString().toLowerCase().indexOf(searchText) >
            -1 ||
          d.mediaLink.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.annee.toString().toLowerCase().indexOf(searchText) > -1 ||
          this.getMonthOfNumer(d.mois).toLowerCase().indexOf(searchText) > -1
      );
      this.gagnantListFiltered = [...rows];
      this.gagnantListFiltered.sort(function (a, b) {
        if (a.postedAt < b.postedAt) {
          return 1;
        }
        if (a.postedAt > b.postedAt) {
          return -1;
        }
        return 0;
      });
    }
  }

  filerDataUtilisateur(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.userFilteredList = [...this.userList];
    }

    if (searchText) {
      const rows = this.userList.filter(
        (d) =>
          d.fullName.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.email.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.phoneNumber.toString().toLowerCase().indexOf(searchText) > -1
      );
      this.userFilteredList = [...rows];
    }
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

  async ouvrirLink(gagnant: any): Promise<void> {
    await Browser.open({ url: 'https://web.facebook.com/watch/?v='+gagnant.video_id });
  }
}
