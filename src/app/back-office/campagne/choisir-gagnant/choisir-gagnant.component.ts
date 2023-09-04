import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Campagne } from 'src/app/models/campagne';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-choisir-gagnant',
  templateUrl: './choisir-gagnant.component.html',
  styleUrls: ['./choisir-gagnant.component.css']
})
export class ChoisirGagnantComponent implements OnInit {

  idcampagne = '';
  oneCampagne: Campagne = new Campagne();

  postList: Post[] = [];
  postListFiltered: Post[] = [];
  user: User = new User();

  oneGagnant: any = null;
  nbreGagnant = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public toastr: ToastrService,
    private campagneService: CampagneService,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = data != '' ? data : null;
      }
    });
    this.idcampagne = this.activeRoute.snapshot.params['idcampagne'];
    console.log(this.idcampagne);
    if (
      this.idcampagne != undefined &&
      this.idcampagne != '' &&
      this.idcampagne != null
    ) {
      this.campagneService
        .getCampagneByID(this.idcampagne)
        .pipe(take(1))
        .subscribe((data: any) => {
          console.log(data);
          this.oneCampagne = data;
          this.nbreGagnant = this.oneCampagne.nombreGagnant;
          //this.makeForm();
        });

      this.list();
    }
  }


  list(): void {
    this.postList = [];
    this.postService
    .getPostListByStatutAndCampagne('POSTÉ', this.idcampagne)
      .pipe(take(1))
      .subscribe((data: any) => {
        console.log(data);
        this.postList = data;
        this.postListFiltered = this.postList;
      });
  }

  backToPrevious(): void {
    this.router.navigate(['/back-office/gerer-gagnant/'+this.oneCampagne.id]);
  }

  updatingPublication(): void {
      const i = this.postList.findIndex(
        (element) => element.id === this.oneGagnant.id
      );
      const j = this.postListFiltered.findIndex(
        (element) => element.id === this.oneGagnant.id
      );
      this.postService.activatedOrLockedPost(this.oneGagnant.id, 'GAGNÉ');
      this.campagneService.updateNombreGagnantCampagne(
        this.idcampagne,
        1
      );
      this.nbreGagnant += 1;
      this.postList.splice(i, 1);
      this.postListFiltered.splice(j, 1);
      this.toastr.success('Publication gagnante !');
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

  async ouvrirLink(gagnant: any): Promise<void> {
    await Browser.open({ url: 'https://web.facebook.com/watch/?v='+gagnant.video_id });
  }

  selectItem(value: any): void {
    this.oneGagnant = value;
  }

  filerDataPublication(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.postListFiltered = [...this.postList];
    }

    if (searchText) {
      const rows = this.postList.filter(
        (d) =>
          d.content.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.postedBy.fullName.toString().toLowerCase().indexOf(searchText) >
            -1 ||
          d.mediaLink.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.annee.toString().toLowerCase().indexOf(searchText) > -1 ||
          this.getMonthOfNumer(d.mois).toLowerCase().indexOf(searchText) > -1
      );
      this.postListFiltered = [...rows];
    }
  }

}
