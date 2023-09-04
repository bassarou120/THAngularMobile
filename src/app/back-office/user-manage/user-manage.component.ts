import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  searchControl: FormControl = new FormControl();

  isBusy = false;
  isSearchingForm = false;
  searchValue: string = '';

  userList: User[] = [];
  userFilteredList: User[] = [];

  userSelected: any = null;

  actionChoose = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService
    .getUsersList()
    .pipe(take(1))
    .subscribe((res: User[]): void => {
      this.userList = res;
      this.userFilteredList = this.userList;
      console.log('res', res);
    });
  }

  chooseDeleteOrChangeStatus(i: number) {
    this.actionChoose = i;
  }

  selectedUser(user: User): void {
    this.userSelected = user;
  }

  resetSelectedUser(): void {
    this.userSelected = new User();
  }

  deletedUser(user: User): void {
    const i = this.userList.findIndex(element => element.id === user.id);
    const j = this.userFilteredList.findIndex(element => element.id === user.id);
    this.userService.deleteUser(user);
    this.userList.splice(i, 1);
    this.userFilteredList.splice(j, 1);
    this.toastr.success('Compte abonné supprimé avec succès');
    this.userSelected = null;
  }

  updatedUserStatus(user: User): void {
    const i = this.userList.findIndex(element => element.id === user.id);
    const j = this.userFilteredList.findIndex(element => element.id === user.id);
    let status = user.status == 'ACTIF' ? 'BLOQUÉ' : 'ACTIF';
    user.status = status;
    this.userService.activatedOrLockedUser(user.id, status);
    this.userList[i] = user;
    this.userFilteredList[j] = user;
    if(this.userSelected && this.userSelected.id) {
      this.userSelected.status = status;
    }
    this.toastr.success('Statut du compte abonné mise à jour avec succès');
  }


  updatedUserProfil(user: User): void {
    const i = this.userList.findIndex(element => element.id === user.id);
    const j = this.userFilteredList.findIndex(element => element.id === user.id);
    let status = user.role == 'ADMINISTRATEUR' ? 'ABONNÉ' : 'ADMINISTRATEUR';
    user.role = status;
    this.userService.changerUserRole(user.id, status);
    this.userList[i] = user;
    this.userFilteredList[j] = user;
    if(this.userSelected && this.userSelected.id) {
      this.userSelected.role = status;
    }
    this.toastr.success('Profil du compte mise à jour avec succès');
  }

  setSearchForm(): void {
      this.isSearchingForm = !this.isSearchingForm;
      this.searchValue = '';
      if( this.isSearchingForm == false ) {
        this.userFilteredList = this.userList;
      }
  }

  filerData(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
       this.userFilteredList = [...this.userList];
    }

    if(searchText) {
      const rows = this.userList.filter((d) =>
        ((d.fullName.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.status.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.email.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.phoneNumber.toString().toLowerCase().indexOf(searchText) > -1)));
      this.userFilteredList = [...rows];
    }

  }

}
