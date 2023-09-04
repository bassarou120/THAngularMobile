import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { parsePhoneNumber } from "awesome-phonenumber";
import codes from "country-calling-code";
import { Country } from './models/country';
import { CountryService } from './services/country.service';

import { initializeApp  } from "@angular/fire/app";
import { initializeAppCheck, ReCaptchaV3Provider  } from "@angular/fire/app-check";
import { environment } from 'src/environments/environment';
import { User } from './models/user';
import { Router } from '@angular/router';
import { TokenStorage } from './services/token.storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TalentHeroesAngular';
  user: User = new User();

  public contryList = codes;

  constructor(
    public toastr: ToastrService,
    private router: Router,
    private countryService: CountryService,
    private tokenStorage: TokenStorage
  ) {
  }

  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
    // key is the counterpart to the secret key you set in the Firebase console.
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LerLr8nAAAAAEMp04YvpDmtgYI4AKLUkthz25w_'),
      // provider: new ReCaptchaV3Provider('6Lc3ZokiAAAAANOKeGbKaBgfOIFfzvSY768QOrGB'),
      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true
    });
    //this.makeCountriesList();
    if(this.tokenStorage.getToken() != null) {
      this.router.navigate(['/back-office']);
    }
  }

  makeCountriesList(): void {
    if(this.contryList && this.contryList.length > 0) {
      let country: Country;
      this.contryList.forEach((element, index)=> {
        country = new Country();
        const pn = parsePhoneNumber("", element.isoCode2);
        country.codeCountry = element.isoCode2;
        country.codePhone = "+"+ pn.getCountryCode();
        country.name = element.country.toUpperCase();
        this.countryService.addCountry(country);

        if(index == (this.contryList.length - 1)) {
          this.toastr.success('pays ajouté avec succès !');
        }
      });
    }
  }
}
