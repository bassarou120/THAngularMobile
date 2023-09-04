import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Campagne } from 'src/app/models/campagne';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';
import { TokenStorage } from 'src/app/services/token.storage';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-campagne-publication',
  templateUrl: './campagne-publication.component.html',
  styleUrls: ['./campagne-publication.component.css'],
})
export class CampagnePublicationComponent implements OnInit {
  isSearchingForm = false;
  searchValue: string = '';
  postForm!: FormGroup;

  user: User = new User();

  idcampagne = '';
  oneCampagne: any = null;
  isBusy = false;
  postList: Post[] = [];
  postListFiltered: Post[] = [];
  campagneList: Campagne[] = [];
  onePost: Post = new Post();

  i = 0;

  onPost: any = null;

  pageObject: any = null;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private campagneService: CampagneService,
    private postService: PostService,
    private activeRoute: ActivatedRoute,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.postService
    .checkUser()
    .pipe(take(1))
    .subscribe((data: any) => {
      this.pageObject = data;
      console.log('user facebook ===> ', this.pageObject);
    });
    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = data != '' ? data : null;
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
            });
        }
        this.list();
      }
    });
  }

  list(): void {
    if (
      this.idcampagne != undefined &&
      this.idcampagne != '' &&
      this.idcampagne != null
    ) {
      this.postService
        .getPostListSentForUserByCampagne(this.user.id, this.idcampagne)
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
    } else {
      this.postService
        .getPostListSentForUser(this.user.id)
        .pipe(take(1))
        .subscribe((data: any) => {
          console.log(data);
          this.postList = data;
          this.postListFiltered = data;
        });
    }
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  deletedPost(post: Post): void {
    const i = this.postList.findIndex((element) => element.id === post.id);
    const j = this.postListFiltered.findIndex(
      (element) => element.id === post.id
    );
    this.postService.deletePost(post);
    this.campagneService.updateNombrePublicationCampagne(this.idcampagne, -1);
    this.postList.splice(i, 1);
    this.postListFiltered.splice(j, 1);

      this.postService.deleteVideo(this.pageObject.data[0].access_token, post.video_id).subscribe(
        (data: any) => {
          console.log('Pièce réponse!', data);
          this.toastr.success('vidéo annulée');
          this.postForm.get('video_id')?.setValue(null);
        },
        (error: HttpErrorResponse) => {
          this.toastr.error('Erreur système !');
        }
      );

    this.toastr.success('Post supprimé avec succès !');
    this.onePost = new Post();
  }

  filerData(val: any): void {
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

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

  async ouvrirDetail(): Promise<void> {
    await Browser.open({ url: 'https://web.facebook.com/watch/?v='+this.onPost?.video_id });
  }

  selectItem(value: any): void {
    this.onPost = value;
    console.log(this.onPost);
  }
}
