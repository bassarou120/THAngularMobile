import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Campagne } from 'src/app/models/campagne';
import { Country } from 'src/app/models/country';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { CountryService } from 'src/app/services/country.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-campagne',
  templateUrl: './campagne.component.html',
  styleUrls: ['./campagne.component.css'],
})
export class CampagneComponent implements OnInit {

  isSearchingForm = false;
  searchValue: string = '';
  campagneForm!: FormGroup;
  i = 1;
  user: User = new User();
  isBusy = false;

  campagneList: Campagne[] = [];
  campagneListFiltered: Campagne[] = [];
  oneCampagne: any = null;

  userList: User[] = [];
  userFilteredList: User[] = [];
  countriesList: Country[] = [];
  countriesFilterList: Country[] = [];
  visibiliteList = [
    { name: 'TOUT LE MONDE', key: 'TOUT LE MONDE' },
    { name: "GROUPE D'ABONNÉS", key: "GROUPE D'ABONNÉS" },
    { name: "ABONNÉS D'UN PAYS", key: "ABONNÉS D'UN PAYS" },
  ];

  userListByCampagne: User[] = [];
  userListFiltredByCampagne: User[] = [];

  userFilteredTypingList: User[] = [];
  actionChoose = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private campagneService: CampagneService,
    private userService: UserService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.userService
      .getUsersList()
      .pipe(take(1))
      .subscribe((res: User[]): void => {
        this.userList = res;
        this.userFilteredList = this.userList;
        console.log('res', res);
      });
    this.countryService
      .getCountrysList()
      .pipe(take(1))
      .subscribe((res: Country[]): void => {
        this.countriesList = res;
        this.countriesFilterList  = res;
        console.log('res', res);
      });
      this.sharedService.getUser().then((data: any) => {
        console.log(data);
        if (data) {
          this.user = Object.keys(data).length > 0 ? data : null;
        }
    });

    this.list();
    this.makeForm();
  }

  list(): void {
    this.campagneService
    .getCampagnesList()
    .pipe(take(1))
    .subscribe((res: Campagne[]): void => {
      this.campagneList = res;
      this.campagneList.sort(function (a, b) {
        if (a.postedAt < b.postedAt) {
          return 1;
        }
        if (a.postedAt > b.postedAt) {
          return -1;
        }
        return 0;
      });
      this.campagneListFiltered = this.campagneList;
      console.log('res', res);
    });
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  openLienMedia(urlLien: string): void {
    //location.href = urlLien;
    window.open(urlLien, '_blank');
  }

  deletedCampagne(campagne: Campagne): void {
    const i = this.campagneList.findIndex(
      (element) => element.id == campagne.id
    );
    const j = this.campagneListFiltered.findIndex(
      (element) => element.id == campagne.id
    );
    this.campagneService.deleteCampagne(campagne);
    this.campagneList.splice(i, 1);
    this.campagneListFiltered.splice(j, 1);
    this.toastr.success('Campagne supprimée avec succès');
    this.oneCampagne = null;
  }

  chooseDeleteOrChangeStatus(i: number): void {
    this.actionChoose = i;
  }

  updatedCampagneStatus(campagne: Campagne): void {
    const i = this.campagneList.findIndex(
      (element) => element.id === campagne.id
    );
    const j = this.campagneListFiltered.findIndex(
      (element) => element.id === campagne.id
    );
    let status = campagne.status == 'EN COURS' ? 'CLÔTURÉE' : 'EN COURS';
    campagne.status = status;
    this.campagneService.activatedOrLockedCampagne(campagne.id, status);
    this.campagneList[i] = campagne;
    this.campagneListFiltered[j] = campagne;
    this.toastr.success('Statut de la campagne mise à jour avec succès');
  }

  generateUserListChoiced(value: string): void {
    this.userFilteredList = [];
    this.campagneForm.get('userList')?.setValue(null);
    this.campagneForm.get('usersIds')?.setValue(null);
    const formData = this.campagneForm.value;
    if (value == 'a' && formData.visibilite == 'TOUT LE MONDE') {
      this.userFilteredList = this.userList;
    }
    if (value == 'b') {
      this.userFilteredList = this.userList.filter(
        (user) => user.country.id == formData.countryId
      );
    }
    this.campagneForm.get('userList')?.setValue(this.userFilteredList);
    this.campagneForm
      .get('usersIds')
      ?.setValue(this.userFilteredList.map((element) => element.id));
  }

  generateUserListSeletedChoiced(element: any, i: number): void {
    console.log(element.target.checked);
    console.log(this.userFilteredTypingList[i].id);
    if (element.target.checked) {
      this.userFilteredList.unshift(this.userFilteredTypingList[i]);
    } else {
      const index = this.userFilteredList.findIndex(
        (elt) => elt.id == this.userFilteredTypingList[i].id
      );
      this.userFilteredList.splice(index, 1);
    }
    this.campagneForm.get('userList')?.setValue(this.userFilteredList);
    this.campagneForm
      .get('usersIds')
      ?.setValue(this.userFilteredList.map((element) => element.id));
    console.log(this.campagneForm.value);
  }

  makeForm(): void {
    this.campagneForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      limitedAt: [null],
      status: ['EN COURS'],
      postedBy: [this.user && this.user.id ? this.user : null],
      mois: [(new Date().getMonth() + 1).toString()],
      annee: [new Date().getFullYear().toString()],
      visibilite: [null, [Validators.required]],
      countryId: [null],
      userList: [null, [Validators.required]],
      usersIds: ['', [Validators.required]],
    });
  }

  linkTo(url: string): void {
    this.router.navigate([url]);
  }

  sendCampagne(): void {
    const formData = this.campagneForm.value;
    this.isBusy = true;
    if (this.user && this.user.id) {
      if (this.campagneForm.valid) {
        formData.postedBy = this.user;
        this.campagneService.addCampagne(formData);
        this.toastr.success('Campagne publiée avec succès !');
        this.makeForm();
        this.isBusy = false;
      } else {
        this.toastr.error('Formulaire invalid !');
        this.isBusy = false;
      }
    } else {
      this.toastr.error('Utilisateur inexistant !');
      this.isBusy = false;
    }
  }


  getDetailCampagne(value: Campagne): void {
    this.oneCampagne = value;
    this.userListByCampagne = this.oneCampagne.userList;
    this.userListFiltredByCampagne = this.oneCampagne.userList;
  }

  filerDataUserListFiltredByCampagne(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
       this.userListFiltredByCampagne = [...this.userListByCampagne];
    }

    if(searchText) {
      const rows = this.userList.filter((d) =>
        ((d.fullName.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.status.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.email.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.phoneNumber.toString().toLowerCase().indexOf(searchText) > -1)));
      this.userListFiltredByCampagne = [...rows];
    }
  }

  filerData(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.campagneListFiltered = [...this.campagneList];
    }

    if (searchText) {
      const rows = this.campagneList.filter(
        (d) =>
          d.title.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.postedBy.fullName.toString().toLowerCase().indexOf(searchText) >
            -1 ||
          d.content.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.annee.toString().toLowerCase().indexOf(searchText) > -1 ||
          this.getMonthOfNumer(d.mois).toLowerCase().indexOf(searchText) > -1 ||
          d.status.toString().toLowerCase().indexOf(searchText) > -1
      );
      this.campagneListFiltered = [...rows];
      this.campagneListFiltered.sort(function (a, b) {
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

  manageGagnantList(id: string) {
    this.router.navigate(['/back-office/gerer-gagnant/' + id]);
  }

  manageList(id: string, i:number): void {
    this.router.navigate(['/back-office/liste-campagne/' + id]);
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }


  filerDataCountry(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.countriesFilterList = [...this.countriesList];
    }

    if (searchText) {
      const rows = this.countriesList.filter(
        (d) =>
          d.name.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.codeCountry.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.codePhone.toString().toLowerCase().indexOf(searchText) > -1
      );
      this.countriesFilterList = [...rows];
    }
  }


  selectCountryValue(element: any): void {
    console.log(element?.value);
    //const country = this.countriesFilterList.find((elt) => elt.id == element?.value);
    this.campagneForm.get('countryId')?.setValue(element?.value);
    this.generateUserListChoiced('b');
    console.log(this.campagneForm.value);
  }

  filerDataUtilisateur(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.userFilteredTypingList = [...this.userList];
    }

    if (searchText) {
      const rows = this.userList.filter(
        (d) =>
          d.fullName.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.email.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.phoneNumber.toString().toLowerCase().indexOf(searchText) > -1
      );
      this.userFilteredTypingList = [...rows];
    }
  }
}
