import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Campagne } from 'src/app/models/campagne';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';
import { TokenStorage } from 'src/app/services/token.storage';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {

  isSearchingForm = false;
  i = 1;
  user: User = new User();
  isBusy = false;

  postList: Post[] = [];
  campagneList: Campagne[] = [];
  campagneListFiltered: Campagne[] = [];

  campagneSelected: Campagne = new Campagne();

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public toastr: ToastrService,
    private campagneService: CampagneService,
    private postService: PostService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {

    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = Object.keys(data).length > 0 ? data : null;
        if(this.user != null) {
          console.log('user.id', this.user.id)
          this.campagneService
            .getCampagnesListSentForUser(this.user.id)
            .pipe(take(1))
            .subscribe((res: Campagne[]): void => {
              this.campagneList = res ? res : [];
              this.campagneList.sort(function (a, b) {
                if (a.postedAt < b.postedAt) {
                  return 1;
                }
                if (a.postedAt > b.postedAt) {
                  return -1;
                }
                return 0;
              });
              this.campagneListFiltered = this.campagneList;
              console.log('res', res);
            });
            this.postService
            .getPostListSentForUser(this.user.id)
            .pipe(take(1))
            .subscribe((res: Post[]): void => {
              this.postList = res;
            });
        }
      }
    });
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  setSearchForm(): void {
      this.isSearchingForm = !this.isSearchingForm;
      this.campagneListFiltered = [...this.campagneList];
  }

  getNombrePostByCampagneId(id: string): number {
    let i = 0;
    if(this.postList) {
      const filtreList = this.postList.filter(element => element.idcampagne == id);
      i = filtreList.length;
    }
    return i;
  }

  filerData(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
       this.campagneListFiltered = [...this.campagneList];
    }

    if(searchText) {
      const rows = this.campagneList.filter((d) =>
        ((d.title.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.postedBy.fullName.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.content.toString().toLowerCase().indexOf(searchText) > -1) ||
        (d.annee.toString().toLowerCase().indexOf(searchText) > -1) ||
        (this.getMonthOfNumer(d.mois).toLowerCase().indexOf(searchText) > -1) ||
        (d.status.toString().toLowerCase().indexOf(searchText) > -1)));
      this.campagneListFiltered = [...rows];
      this.campagneListFiltered.sort(function (a, b) {
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

  managePublicationList(id: string) {
    this.router.navigate(['/back-office/campagne-publication/'+id]);
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

  selectCampagne(value: any) {
    this.campagneSelected = value;
  }

  lireDetailCampagne(): void {
    this.router.navigate(['/back-office/campagne-publication/'+this.campagneSelected?.id]);
  }
}
