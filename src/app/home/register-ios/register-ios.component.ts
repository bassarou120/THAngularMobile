import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Country } from 'src/app/models/country';
import { CountryService } from 'src/app/services/country.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import {interval, Subscription, switchMap, take, takeWhile, timer} from 'rxjs';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from '@angular/fire/auth';
import { WindowService } from 'src/app/services/window.service';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register-ios.component.html',
  styleUrls: ['./register-ios.component.css'],
})
export class RegisterIosComponent implements OnInit,AfterViewInit {
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


  // @ViewChild('iframe', { static: true }) iframe: ElementRef ;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _elementRef : ElementRef,
    private router: Router,
    private countryService: CountryService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService,
    private windowService: WindowService
  ) {}
  subscription !: Subscription;

  ngAfterViewInit(): void {
    window.addEventListener("message", this.receiveMessage, false);
    // var frame = document.getElementById('your-frame-id');
    // frame.contentWindow.postMessage({}, '*');
  }
  receiveMessage(event:any) {
    if (event.data === 'close') {
      // close dialog
      this.router.navigate(["/login"]);
       // alert("je quitte mainteneant")

    }
  }
  controle(){



   //  const docs = (window.document.getElementById('myIfram') as HTMLIFrameElement);
   //  var y = (docs.contentWindow || docs.contentDocument);
   //
   //  console.log(   this.document.body.getElementsByTagName('iframe'));
   //  var list =this.document.body.getElementsByTagName('iframe')
   // console.log( list[0].contentWindow)

   // let a= window.document.getElementById('someID');

    // let domElement = this._elementRef.nativeElement.querySelector("iframe")
    // let domElement = this._elementRef.nativeElement.querySelector('iframe').
      // .nativeElement.querySelector(`#someID`);

    // console.log(domElement)
  //   const docs = (window.document.getElementById('iframe')  as HTMLIFrameElement)
  //   //

  // var innerDoc = docs.contentDocument || docs.contentWindow!.document;
    //

    // const propertyNames = Object.keys(domElement);
   //
   // console.log( propertyNames );
    // console.log(window.localStorage);
    // console.log(window.localStorage.getItem("REGISTER_KEY"));
    // console.log(window.sessionStorage.getItem("REGISTER_KEY"));
    // // console.log(document.getElementById("iframe")!.getElementsByClassName("bassarou")[0])

    return "1";
  }
  ngOnInit(): void {

    window.addEventListener("message", this.receiveMessage, false);

    // this.subscription = timer(0, 5000).pipe(
    //   switchMap(() => {
    //    return  this.controle()
    //   })
    // ).subscribe(result =>
    //   console.log(result)
    // );

    // const auth = getAuth();
    // this.windowRef = this.windowService.windowRef;
    //
    // this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
    //   'recaptcha-container',
    //   { size: 'invisible' },
    //   auth
    // );

    // this.windowRef.recaptchaVerifier.render();
    //
    // if(this.windowRef.recaptchaVerifier) {
    //   this.appVerifier = this.windowRef.recaptchaVerifier;
    // }

    // this.countryService.getCountrysList().pipe(take(1)).subscribe((res: Country[]): void => {
    //   this.countriesList = res;
    //   console.log('res', res);
    //   if(this.countriesList.length > 0) {
    //     this.countriesList.sort(
    //       (firstObject: any, secondObject: any) =>
    //         (firstObject.name > secondObject.name) ? 1 : -1
    //     );
    //     this.countriesFilterList = this.countriesList;
    //   }
    // });
    // this.makeForm();
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

  test(){

    // alert()

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
           this.router.navigate(["/login"]);
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

  iframeURLChange(iframe:any, callback:any) {
    var lastDispatched:any = null;

    var dispatchChange = function () {
      var newHref = iframe.contentWindow.location.href;

      if (newHref !== lastDispatched) {
        callback(newHref);
        lastDispatched = newHref;
      }
    };

    var unloadHandler = function () {
      // Timeout needed because the URL changes immediately after
      // the `unload` event is dispatched.
      setTimeout(dispatchChange, 0);
    };

    function attachUnload() {
      // Remove the unloadHandler in case it was already attached.
      // Otherwise, there will be two handlers, which is unnecessary.
      iframe.contentWindow.removeEventListener("unload", unloadHandler);
      iframe.contentWindow.addEventListener("unload", unloadHandler);
    }

    iframe.addEventListener("load", function () {
      attachUnload();

      // Just in case the change wasn't dispatched during the unload event...
      dispatchChange();
    });

    attachUnload();
  }


}
