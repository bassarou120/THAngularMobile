import { Component, OnInit } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs';
import { TokenStorage } from 'src/app/services/token.storage';
import { CapacitorStorageService } from 'src/app/services/capacitor-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  singinForm!: FormGroup;
  isBusy = false;

  isEye = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private userService: UserService,
    private sharedService: SharedService,
    private tokenStorage: TokenStorage,
    private capacitorStorageService: CapacitorStorageService
  ) { }

  ngOnInit(): void {
    this.makeForm();
  }

  homeBack(): void {
    this.router.navigate(['']);
  }

  makeEyeChange(): void {
    this.isEye = !this.isEye;
  }

  makeForm(): void {
    this.singinForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(
          '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
        )]],
      password: ["", [Validators.required]],
    });
  }

  singinAction(): void {
    if (this.singinForm.valid) {
      const formData = this.singinForm.value;
      this.isBusy = true;
      this.userService.singin(formData).pipe(take(1)).subscribe(
        (res: User[]) => {
          if(res && res.length > 0) {
            let user: User = res[0];
            if(user.status == 'ACTIF') {
              if(user.codeVerification != '' && user.codeVerification != null) {
                user.password = '';
                user.codeVerification = '';
                this.sharedService.setUser(user);
                //this.toastr.success('Vous êtes connecté avec succès !');
                console.log('OK back-office');
                this.router.navigate(['/back-office']);
                //location.href = '/back-office';
              } else {
                this.toastr.error("Réinitialisation de compte incomplète !");
              }
            } else {
              this.toastr.error("Compte bloqué !");
            }

          } else {
            this.toastr.error("Identifiants incorrects !");
            this.isBusy = false;
          }

      },
      (error) => {
        this.toastr.error("Connexion échouée !");
        this.isBusy = false;
      })
    } else {
      this.toastr.error("Formulaire invalid !");
      this.isBusy = false;
    }
  }

}
