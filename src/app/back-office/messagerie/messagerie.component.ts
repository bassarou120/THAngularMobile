import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Messagerie } from 'src/app/models/messagerie';
import { User } from 'src/app/models/user';
import { MessagerieService } from 'src/app/services/messagerie.service';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs';
import { Country } from 'src/app/models/country';
import { UserService } from 'src/app/services/user.service';
import { CountryService } from 'src/app/services/country.service';
import { TokenStorage } from 'src/app/services/token.storage';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css'],
})
export class MessagerieComponent implements OnInit {
  isSearchingForm = false;
  searchValue: string = '';
  messagerieForm!: FormGroup;
  i = 1;
  user: User = new User();
  isBusy = false;

  messagerieList: Messagerie[] = [];
  messagerieListFiltered: Messagerie[] = [];
  oneMessagerie: any = null;

  userList: User[] = [];
  userFilteredList: User[] = [];
  userFilteredTypingList: User[] = [];
  userAdministrateurList: User[] = [];
  countriesList: Country[] = [];
  countriesFilterList: Country[] = [];
  visibiliteList = [
    { name: 'TOUT LE MONDE', key: 'TOUT LE MONDE' },
    { name: "GROUPE D'ABONNÉS", key: "GROUPE D'ABONNÉS" },
    { name: "ABONNÉS D'UN PAYS", key: "ABONNÉS D'UN PAYS" },
  ];

  actionChoose = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private messagerieService: MessagerieService,
    private userService: UserService,
    private countryService: CountryService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.userService
      .getUsersList()
      .pipe(take(1))
      .subscribe((res: User[]): void => {
        this.userList = res;
        this.userFilteredList = this.userList;
        this.userFilteredTypingList = this.userList;
        this.userAdministrateurList = this.userList.filter(
          (element) => element.role == 'ADMINISTRATEUR'
        );
        console.log('this.userAdministrateurList', this.userAdministrateurList);
      });
    this.countryService
      .getCountrysList()
      .pipe(take(1))
      .subscribe((res: Country[]): void => {
        this.countriesList = res;
        this.countriesFilterList = this.countriesList;
        console.log('res', res);
      });
      this.sharedService.getUser().then((data: any) => {
        console.log(data);
        if (data) {
          this.user = Object.keys(data).length > 0 ? data : null;
          this.list();
        }
    });

    this.makeForm();
  }

  list(): void {
    this.messagerieService
      .getMessageriesListByUser(this.user.id)
      .pipe(take(1))
      .subscribe((res: Messagerie[]): void => {
        this.messagerieList = res ? res : [];
        this.messagerieList.sort(function (a, b) {
          if (a.postedAt < b.postedAt) {
            return 1;
          }
          if (a.postedAt > b.postedAt) {
            return -1;
          }
          return 0;
        });
        this.messagerieListFiltered = this.messagerieList;
        console.log('res', res);
      });
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  chooseDeleteOrChangeStatus(i: number): void {
    this.actionChoose = i;
  }

  deletedMessagerie(messagerie: Messagerie): void {
    const i = this.messagerieList.findIndex(
      (element) => element.id === messagerie.id
    );
    const j = this.messagerieListFiltered.findIndex(
      (element) => element.id === messagerie.id
    );
    this.messagerieService.deleteMessagerie(messagerie);
    this.messagerieList.splice(i, 1);
    this.messagerieListFiltered.splice(j, 1);
    this.toastr.success('Messagerie supprimée avec succès');
    this.oneMessagerie = null;
  }

  updatedMessagerieStatus(messagerie: Messagerie): void {
    const i = this.messagerieList.findIndex(
      (element) => element.id === messagerie.id
    );
    const j = this.messagerieListFiltered.findIndex(
      (element) => element.id === messagerie.id
    );
    let status = messagerie.status == 'Important' ? 'Archivé' : 'Important';
    messagerie.status = status;
    this.messagerieService.updateStatus(messagerie.id, status);
    this.messagerieList[i] = messagerie;
    this.messagerieListFiltered[j] = messagerie;
    //this.toastr.success('Statut de la messagerie mise à jour avec succès !');
  }

  generateUserListChoiced(value: string): void {
    this.userFilteredList = [];
    this.messagerieForm.get('userList')?.setValue(null);
    this.messagerieForm.get('usersIds')?.setValue(null);
    const formData = this.messagerieForm.value;
    if (value == 'a' && formData.visibilite == 'TOUT LE MONDE') {
      this.userFilteredList = this.userList;
      this.messagerieForm.get('userList')?.setValue(this.userFilteredList);
      this.messagerieForm
        .get('usersIds')
        ?.setValue(this.userFilteredList.map((element) => element.id));
    }
    if (value == 'b') {
      this.userFilteredList = this.userList.filter(
        (user) => user.country.id == formData.countryId
      );
      this.messagerieForm.get('userList')?.setValue(this.userFilteredList);
      this.messagerieForm
        .get('usersIds')
        ?.setValue(this.userFilteredList.map((element) => element.id));
    }

    console.log('this.messagerieForm', this.messagerieForm.value);
  }

  selectCountryValue(element: any): void {
    console.log(element?.value);
    //const country = this.countriesFilterList.find((elt) => elt.id == element?.value);
    this.messagerieForm.get('countryId')?.setValue(element?.value);
    this.generateUserListChoiced('b');
    console.log(this.messagerieForm.value);
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
    this.messagerieForm.get('userList')?.setValue(this.userFilteredList);
    this.messagerieForm
      .get('usersIds')
      ?.setValue(this.userFilteredList.map((element) => element.id));
    console.log(this.messagerieForm.value);
  }

  makeForm(): void {
    this.messagerieForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      limitedAt: [null],
      status: ['Important'],
      type: [
        this.user && this.user.role != 'ADMINISTRATEUR' ? 'Envoi' : 'Réception',
      ],
      postedBy: [this.user && this.user.id ? this.user : null],
      mois: [(new Date().getMonth() + 1).toString()],
      annee: [new Date().getFullYear().toString()],
      visibilite: [
        this.user && this.user.role != 'ADMINISTRATEUR'
          ? "GROUPE D'ABONNÉS"
          : null,
        [Validators.required],
      ],
      countryId: [null],
      userList: [
        this.user && this.user.role != 'ADMINISTRATEUR'
          ? this.userAdministrateurList
          : [],
        [Validators.required],
      ],
      usersIds: [
        this.user && this.user.role != 'ADMINISTRATEUR'
          ? this.userAdministrateurList.map((d) => d.id)
          : [],
        [Validators.required],
      ],
    });
  }

  sendMessagerie(): void {
    const formData = this.messagerieForm.value;
    this.isBusy = true;
    if (this.user && this.user.id) {
      if (this.messagerieForm.valid) {
        formData.postedBy = this.user;
        formData.usersIds.push(formData.postedBy.id);
        formData.userList.push(formData.postedBy);
        this.messagerieService.addMessagerie(formData);
        //this.list();
        this.isBusy = false;
        this.toastr.success('Messagerie publiée avec succès');
        this.makeForm();
      } else {
        this.toastr.error('Formulaire invalid');
        this.isBusy = false;
      }
    } else {
      this.toastr.error('Utilisateur inexistant');
      this.isBusy = false;
    }
  }

  getDetailMessagerie(value: Messagerie): void {
    //this.updatedMessagerieStatus(value);
    this.oneMessagerie = value;
  }

  filerData(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.messagerieListFiltered = [...this.messagerieList];
    }

    if (searchText) {
      const rows = this.messagerieList.filter(
        (d) =>
          d.title.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.postedBy.fullName.toString().toLowerCase().indexOf(searchText) >
            -1 ||
          d.content.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.annee.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.status.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.type.toString().toLowerCase().indexOf(searchText) > -1
      );
      this.messagerieListFiltered = [...rows];
      this.messagerieListFiltered.sort(function (a, b) {
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
}
