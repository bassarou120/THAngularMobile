import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs';
import { CountryService } from 'src/app/services/country.service';
import { Country } from 'src/app/models/country';
import { TokenStorage } from 'src/app/services/token.storage';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.css'],
})
export class MonCompteComponent implements OnInit {
  singupForm!: FormGroup;
  isBusy = false;
  user: User = new User();
  optionForm = 0;
  countriesList: Country[] = [];
  sexeList = [
    { name: 'MASCULIN', key: 'MASCULIN' },
    { name: 'FÉMININ', key: 'FÉMININ' },
  ];

  id = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private userService: UserService,
    private countryService: CountryService,
    public toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];

    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = Object.keys(data).length > 0 ? data : null;
      }
    });

    //this.user = JSON.parse(this.tokenStorage.getToken() || '{}');

    this.countryService
      .getCountrysList()
      .pipe(take(1))
      .subscribe((res: Country[]): void => {
        this.countriesList = res;
        console.log('res', res);
      });
    this.makeForm();
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  setOptionForm(value: number): void {
    this.optionForm = value;
  }

  makeForm(): void {
    this.singupForm = this.fb.group({
      id: [this.user ? this.user.id : '', [Validators.required]],
      fullName: [this.user ? this.user.fullName : '', [Validators.required]],
      country: [this.user ? this.user.country : '', [Validators.required]],
      phoneNumber: [
        this.user ? this.user.phoneNumber : '',
        [Validators.required],
      ],
      email: [
        this.user ? this.user.email : '',
        [
          Validators.required,
          Validators.pattern(
            '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
          ),
        ],
      ],
      sexe: [this.user ? this.user.sexe : ''],
      birthDay: [this.user ? this.user.birthDay : ''],
      birthCity: [this.user ? this.user.birthCity : ''],
      profession: [this.user ? this.user.profession : ''],
    });
  }

  submit(): void {
    const formData = this.singupForm.value;
    if (this.user && this.user.id) {
      if (this.singupForm.valid) {
        this.isBusy = true;
        this.userService
          .getUsersByEmail(formData.email)
          .pipe(take(1))
          .subscribe((res: User[]) => {
            if (res && res.length > 0) {
              //envoi de sms pour vérification
              if(res[0].id == formData.id) {
                this.updateUserAcount(formData);
              } else {
                this.toastr.error('Cette adresse email existe déjà !');
                this.isBusy = false;
              }
            } else {
              this.updateUserAcount(formData);
            }
          });
      } else {
        this.toastr.error('Formulaire invalid !');
        this.isBusy = false;
      }
    } else {
      this.toastr.error('Utilisateur inexistant !');
      this.isBusy = false;
    }
  }

  updateUserAcount(dataUser: any): void {
    const value = this.userService.updateUser(
      dataUser
    );
    console.log(value);
    this.toastr.success('Mise à jour de compte effectuée avec succès !');
    this.isBusy = false;
    this.router.navigate(['/login']);
  }
}
