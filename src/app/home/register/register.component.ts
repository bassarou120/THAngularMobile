import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Country } from 'src/app/models/country';
import { CountryService } from 'src/app/services/country.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { take } from 'rxjs';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from '@angular/fire/auth';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
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

  firtTime=true;

  constructor(
    private router: Router,
    private countryService: CountryService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {



    window.localStorage.setItem("REGISTER_KEY",  "NO");
    window.sessionStorage.setItem("REGISTER_KEY",  "NO");
// if (this.firtTime){
//    this.router.navigate(["/register-ios"]);
//   this.firtTime=false;
// }

    const auth = getAuth();
    this.windowRef = this.windowService.windowRef;

    this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      auth
    );

    this.windowRef.recaptchaVerifier.render();

    if(this.windowRef.recaptchaVerifier) {
      this.appVerifier = this.windowRef.recaptchaVerifier;
    }

    this.countryService.getCountrysList().pipe(take(1)).subscribe((res: Country[]): void => {
      this.countriesList = res;
      console.log('res', res);
      if(this.countriesList.length > 0) {
        this.countriesList.sort(
          (firstObject: any, secondObject: any) =>
            (firstObject.name > secondObject.name) ? 1 : -1
        );
        this.countriesFilterList = this.countriesList;
      }
    });
    this.makeForm();
  }

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

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

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
      this.router.navigate(['']);
    }
  }

  makeForm(): void {
    this.singupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      country: [null, [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
          ),
        ],
      ],
      role: ['ABONNE'],
      codeVerification: [null],
      createdAt: [null],
      confirmation: ['', [Validators.required]],
      password: ['', [Validators.required]],
      isRegleChecked: [false, [Validators.required]],
    });
  }

  changeAccepteCondition(): void {
    this.singupForm.get('isRegleChecked')?.setValue(!this.singupForm.get('isRegleChecked')?.value);
  }

  singupAction(): void {
    const formData = this.singupForm.value;
    if (this.singupForm.valid) {
      this.isBusy = true;
      if (formData.password == formData.confirmation) {
      this.userService
        .getUsersByEmail(formData.email).pipe(take(1))
        .subscribe((res: User[]) => {
          if (res && res.length > 0) {
            this.toastr.error(
              "L'adresse email " + formData.email + ' existe déjà !'
            );
            this.isBusy = false;
          } else {
            //envoi de sms pour vérification

            signInWithPhoneNumber(
              this.auth,
              formData.country.codePhone + '' + formData.phoneNumber,
              this.appVerifier
            )
              .then((result: any) => {
                console.log(result);


                this.windowRef.confirmationResult = result;
                this.isSmsSending = true;
                this.isBusy = false;
                 this.singupForm
                  .get('codeVerification')
                  ?.setValidators(Validators.required);
                  //this.toastr.success('Code sms de confirmation envoyé !');


              })
              .catch((error: any) => {
                this.toastr.error('Erreur d\'envoi du code sms de confirmation');
                console.log(error);
                this.isBusy = false;
              });
            //localStorage.setItem("singup", JSON.stringify(this.singupForm.value));
            //this.router.navigate(["verification-sms"]);
          }
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

  renvoyerCodeSms(): void {
    const formData = this.singupForm.value;
    /* const auth = getAuth();
    const appVerifier = this.windowRef.recaptchaVerifier; */
    signInWithPhoneNumber(
      this.auth,
      formData.country.codePhone + '' + formData.phoneNumber,
      this.appVerifier
    )
      .then((result: any) => {
        console.log(result);
        this.windowRef.confirmationResult = result;
        this.singupForm
          .get('codeVerification')
          ?.setValidators(Validators.required);
          this.toastr.success('Code sms de confirmation envoyé');
      })
      .catch((error: any) => {
        this.toastr.error('Erreur d\'envoi du code sms de confirmation');
        console.log(error);
      });
  }

  confirmationCodeAndSavingUser() {
    const formData = this.singupForm.value;
    if (this.singupForm.valid && formData.codeVerification) {
      this.isBusy = true;
      this.windowRef.confirmationResult
        .confirm(formData.codeVerification)
        .then((result: { user: any; }) => {
           console.log(result.user);

           this.userService.addUser(formData);
           this.toastr.success('Inscription effectuée avec succès');

           window.parent.postMessage('close', '*');

           // this.router.navigate(["/login"]);
        })
        .catch((error: any) => {
          this.isBusy = false;
          console.log(error, 'Incorrect code entered?');
          this.toastr.error('Code sms incorrect pour la confirmation');
        });
    } else {
      this.toastr.error('Formulaire invalid !');
      this.isBusy = false;
    }
  }
}
