import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Country } from 'src/app/models/country';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { CountryService } from 'src/app/services/country.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nouvelle-campagne',
  templateUrl: './nouvelle-campagne.component.html',
  styleUrls: ['./nouvelle-campagne.component.css']
})
export class NouvelleCampagneComponent implements OnInit {

  campagneForm!: FormGroup;
  i = 1;
  user: User = new User();
  isBusy = false;

  userList: User[] = [];
  userFilteredList: User[] = [];
  countriesList: Country[] = [];
  visibiliteList = [
    { name: 'TOUT LE MONDE', key: 'TOUT LE MONDE' },
    { name: "GROUPE D'ABONNÉS", key: "GROUPE D'ABONNÉS" },
    { name: "ABONNÉS D'UN PAYS", key: "ABONNÉS D'UN PAYS" },
  ];

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private activeRoute: ActivatedRoute,
    private campagneService: CampagneService,
    private userService: UserService,
    private countryService: CountryService
  ) { }

  ngOnInit(): void {
    this.userService
      .getUsersList()
      .pipe(take(1))
      .subscribe((res: User[]): void => {
        this.userList = res;
        console.log('res', res);
      });
    this.countryService
      .getCountrysList()
      .pipe(take(1))
      .subscribe((res: Country[]): void => {
        this.countriesList = res;
        console.log('res', res);
      });
      this.sharedService.getUser().then((data: any) => {
        console.log(data);
        if (data) {
          this.user = Object.keys(data).length > 0 ? data : null;
        }
    });
    this.makeForm();
  }


  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  backToPrevious(): void {
    this.router.navigate([
      '/back-office/campagnes',
    ]);
  }

  generateUserListChoiced(value: string): void {
    this.userFilteredList = [];
    if(value == 'a' || value == 'b') {
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
    }
    this.campagneForm
      .get('usersIds')
      ?.setValue(this.campagneForm.get('userList')?.value.map((element: any) => element.id));
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

}
