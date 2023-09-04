import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-reinitialiser-password',
  templateUrl: './reinitialiser-password.component.html',
  styleUrls: ['./reinitialiser-password.component.css'],
})
export class ReinitialiserPasswordComponent implements OnInit {
  singupForm!: FormGroup;
  isBusy = false;
  user: User = new User();

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private userService: UserService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = Object.keys(data).length > 0 ? data : null;
      }
    });
    this.makeForm();
  }

  makeForm(): void {
    this.singupForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      confirmation: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    const formData = this.singupForm.value;
    if (this.user && this.user.id) {
      if (this.singupForm.valid) {
        this.isBusy = true;
        if (formData.password == formData.confirmation) {
          this.userService
            .getUsersByPassword(formData.oldPassword).pipe(take(1))
            .subscribe((res: User[]) => {
              if (res && res.length > 0) {
                //envoi de sms pour vérification
                const value = this.userService.changeUserPassword(
                  this.user.id,
                  formData.password
                );
                console.log(value);
                this.toastr.success('Réinitialisation effectuée avec succès !');
                this.isBusy = false;
                this.router.navigate(['/login']);
              } else {
                this.toastr.error('Ancien mot de passe erroné !');
                this.isBusy = false;
              }
            });
        } else {
          this.toastr.error('Confirmation du nouveau mot de passe erroné !');
          this.isBusy = false;
        }
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
