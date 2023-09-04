import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Campagne } from 'src/app/models/campagne';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-liste-campagne',
  templateUrl: './liste-campagne.component.html',
  styleUrls: ['./liste-campagne.component.css'],
})
export class ListeCampagneComponent implements OnInit {
  i: number = 0;
  idcampagne = '';
  oneCampagne: Campagne = new Campagne();

  postList: Post[] = [];
  postListFiltered: Post[] = [];

  onPost: any = null;

  userList: User[] = [];
  userFilteredList: User[] = [];
  actionChoose = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public toastr: ToastrService,
    private campagneService: CampagneService,
    private activeRoute: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.idcampagne = this.activeRoute.snapshot.params['id'];

    this.campagneService
      .getCampagneByID(this.idcampagne)
      .pipe(take(1))
      .subscribe((data: any) => {
        console.log(data);
        this.oneCampagne = data;
      });
    this.postService
      .getPostListByCampagneId(this.idcampagne)
      .pipe(take(1))
      .subscribe((data: any) => {
        console.log(data);
        this.postList = data ? data : [];
        this.postList.sort(function (a, b) {
          if (a.postedAt < b.postedAt) {
            return 1;
          }
          if (a.postedAt > b.postedAt) {
            return -1;
          }
          return 0;
        });
        this.postListFiltered = this.postList;
      });
  }

  backToPrevious(): void {
    this.router.navigate(['/back-office/campagnes']);
  }

  selectItem(value: any): void {
    this.onPost = value;
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
      this.postListFiltered.sort(function (a, b) {
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

  filerDataParticipant(val: any): void {
    let searchText = '';
    if (val.value) {
      searchText = val.value.toLowerCase();
    } else {
      this.userFilteredList = [...this.userList];
    }
    if (searchText) {
      const rows = this.userList.filter(
        (d) =>
          d.fullName.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.status.toString().toLowerCase().indexOf(searchText) > -1 ||
          d.phoneNumber.toString().toLowerCase().indexOf(searchText) > -1
      );
      this.userFilteredList = [...rows];
    }
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

  chooseDeleteOrChangeStatus(i: number): void {
    this.actionChoose = i;
  }

  updatedPostStatus(campagne: Post): void {
    const i = this.postList.findIndex((element) => element.id === campagne.id);
    const j = this.postListFiltered.findIndex(
      (element) => element.id === campagne.id
    );
    let status = (campagne.status == 'POSTÉ' || campagne.status == 'GAGNÉ') ? 'BLOQUÉ' : 'POSTÉ';
    campagne.status = status;
    this.postService.activatedOrLockedPost(campagne.id, status);
    this.postList[i] = campagne;
    this.postListFiltered[j] = campagne;
    this.toastr.success('Statut de la publication mise à jour');
  }

  deletedPost(post: Post): void {
    const i = this.postList.findIndex((element) => element.id === post.id);
    const j = this.postListFiltered.findIndex(
      (element) => element.id === post.id
    );
    this.postService.deletePost(post);
    this.campagneService.updateNombrePublicationCampagne(this.idcampagne, -1);
    this.postList.splice(i, 1);
    this.postListFiltered.splice(j, 1);
    this.toastr.success('Post supprimé avec succès !');
  }


  async ouvrirLink(): Promise<void> {
    await Browser.open({ url: 'https://web.facebook.com/watch/?v='+this.onPost.video_id });
  }
}
