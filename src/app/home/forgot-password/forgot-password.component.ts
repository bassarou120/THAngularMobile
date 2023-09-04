import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/country';

import { take } from 'rxjs';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from '@angular/fire/auth';
import { WindowService } from 'src/app/services/window.service';
import { CountryService } from 'src/app/services/country.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  countriesList: Country[] = [];
  countriesFilterList: Country[] = [];
  countryFilter = '';
  i: number = 0;
  singupForm!: FormGroup;
  isBusy = false;
  isSmsSending: boolean = false;

  windowRef: any;

  auth = getAuth();
  appVerifier: any;

  isEye = false;
  isEyeConfirmation = false;

  user: User = new User();

  constructor(
    private router: Router,
    private countryService: CountryService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {
    const auth = getAuth();
    this.windowRef = this.windowService.windowRef;

    this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      auth
    );

    this.windowRef.recaptchaVerifier.render();

    if (this.windowRef.recaptchaVerifier) {
      this.appVerifier = this.windowRef.recaptchaVerifier;
    }

    this.countryService
      .getCountrysList()
      .pipe(take(1))
      .subscribe((res: Country[]): void => {
        this.countriesList = res;
        this.countriesFilterList = this.countriesList;
        console.log('res', res);
      });
    this.makeForm();
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  filterCountriesList(): void {
    if(this.countryFilter == '' || this.countryFilter == null) {
      this.countriesFilterList = this.countriesList;
    } else {
      this.countriesFilterList = this.countriesList.filter((element) => element.name.toLowerCase().indexOf(this.countryFilter.toLowerCase()) > -1);
    }
  }

  selectCountryValue(value: any): void {
    this.singupForm.get('country')?.setValue(value);
  }

  makeEyeChange(): void {
    this.isEye = !this.isEye;
  }

  makeEyeConfirmationChange(): void {
    this.isEyeConfirmation = !this.isEyeConfirmation;
  }

  homeBack(): void {
    if (this.isSmsSending == true) {
      this.isSmsSending = false;
      this.singupForm.get('codeVerification')?.setValue(null);
      this.singupForm.get('codeVerification')?.setValidators(null);
    } else {
      this.router.navigate(['/login']);
    }
  }

  makeForm(): void {
    this.singupForm = this.fb.group({
      phoneNumber: ['', [Validators.required]],
      country: [null, [Validators.required]],
      codeVerification: [null, [Validators.required]],
      confirmation: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  checkAtion(): void {
    if(this.i == 0) {
      this.rechercherUser();
    }
    if(this.i == 1) {
      this.confirmationCodeSms();
    }
  }

  rechercherUser(): void {
    const formData = this.singupForm.value;
    if (
      formData.country &&
      formData.phoneNumber != null &&
      formData.phoneNumber.trim() != ''
    ) {
      this.isBusy = true;
      this.userService
        .getUsersByPhoneNumber(formData.country.codePhone, formData.phoneNumber)
        .pipe(take(1))
        .subscribe((res: User[]) => {
          if (res && res.length > 0) {
            this.user = res[0];
            this.isBusy = false;
            if (this.user.isCodeSent && this.user.isCodeSent == true) {
              this.i += 1;
            } else {
              signInWithPhoneNumber(
                this.auth,
                formData.country.codePhone + '' + formData.phoneNumber,
                this.appVerifier
              )
                .then((result: any) => {
                  console.log(result);
                  this.windowRef.confirmationResult = result;
                  this.isBusy = false;
                  this.toastr.success('Code sms de confirmation envoyé !');

                  this.userService
                    .annulerCodeVerification(this.user.id)
                    .then((result: any) => {
                      this.i += 1;
                    });
                })
                .catch((error: any) => {
                  this.toastr.error("Erreur d'envoi du code sms de confirmation");
                  console.log(error);
                  this.isBusy = false;
                });
            }
          } else {
            this.isBusy = false;
            this.toastr.error("Aucun compte n'est associé à ce contact !");
          }
        });
    } else {
      this.toastr.error('Formulaire invalid !');
      this.isBusy = false;
    }
  }

  confirmationCodeSms() {
    const formData = this.singupForm.value;
    if (
      formData.codeVerification &&
      formData.codeVerification != null &&
      formData.codeVerification.trim() != ''
    ) {
      this.isBusy = true;
      this.windowRef.confirmationResult
        .confirm(formData.codeVerification)
        .then((result: { user: any }) => {
          console.log(result.user);
          this.isBusy = false;
          this.i += 1;
        })
        .catch((error: any) => {
          this.isBusy = false;
          console.log(error, 'Incorrect code entered?');
          this.toastr.error('Code sms incorrect pour la confirmation  !');
        });
    } else {
      this.toastr.error('Formulaire invalid !');
      this.isBusy = false;
    }
  }


  singupAction(): void {
    const formData = this.singupForm.value;
    if (this.singupForm.valid) {
      this.isBusy = true;
      if (formData.password == formData.confirmation) {

        this.userService
        .reinitialisationPasswordUser(this.user.id, formData)
        .then((result) => {

          this.toastr.success('Mot de passe réinitialisé !');
          this.isBusy = false;
          this.router.navigate(['/login']);

        }).catch((error: any) => {
          this.isBusy = false;
          this.toastr.error('Réinitialisation échouée  !');
        });

      } else {
        this.toastr.error('Confirmation du mot de passe erroné !');
        this.isBusy = false;
      }
    } else {
      this.toastr.error('Formulaire invalid !');
      this.isBusy = false;
    }
  }

}
