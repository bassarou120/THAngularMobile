import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Gagnant } from 'src/app/models/gagnant';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { GagnantService } from 'src/app/services/gagnant.service';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-gagnant',
  templateUrl: './gagnant.component.html',
  styleUrls: ['./gagnant.component.css'],
})
export class GagnantComponent implements OnInit {
  isSearchingForm = false;
  searchValue: string = '';

  user: User = new User();

  gagnantList: Post[] = [];
  gagnantListFiltered: Post[] = [];

  onGagnant: any = null;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private gagnantService: GagnantService,
    private activeRoute: ActivatedRoute,
    public toastr: ToastrService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = Object.keys(data).length > 0 ? data : null;
      }
    });

    this.postService
    .getPostListByStatut('GAGNÉ')
    .pipe(take(1))
    .subscribe((data: any) => {
      console.log(data);
      this.gagnantList = data ? data : [];
      this.gagnantList.sort(function (a, b) {
        if (a.postedAt < b.postedAt) {
          return 1;
        }
        if (a.postedAt > b.postedAt) {
          return -1;
        }
        return 0;
      });
      this.gagnantListFiltered = this.gagnantList;
    });
  }

  setSearchForm(): void {
    this.isSearchingForm = !this.isSearchingForm;
    this.gagnantListFiltered = [...this.gagnantList];
  }

  selectItem(value: any): void {
    this.onGagnant = value;
  }

  filerData(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.gagnantListFiltered = [...this.gagnantList];
    }

    if (searchText) {
      const rows = this.gagnantList.filter(
        (d) =>
          d.content.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.postedBy.fullName.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.mediaLink.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.annee.toString().toLowerCase().indexOf(searchText) > -1 ||
          this.getMonthOfNumer(d.mois).toLowerCase().indexOf(searchText) > -1
      );
      this.gagnantListFiltered = [...rows];
      this.gagnantListFiltered.sort(function (a, b) {
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

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

  ouvrirLienMedia(i: number, id: string): void {
    this.router.navigate(['/back-office/visualisation/' + i + '/' + id]);
  }

  async ouvrirLink(gagnant: any): Promise<void> {
    await Browser.open({ url: 'https://web.facebook.com/watch/?v='+gagnant.video_id });
  }
}
