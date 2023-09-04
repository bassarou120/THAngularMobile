import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { CampagneService } from 'src/app/services/campagne.service';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  FacebookService,
  FBVideoComponent,
  InitParams,
  UIParams,
  UIResponse,
} from 'ngx-facebook';

@Component({
  selector: 'app-nouvelle-publication',
  templateUrl: './nouvelle-publication.component.html',
  styleUrls: ['./nouvelle-publication.component.css'],
  providers: [FacebookService],
})
export class NouvellePublicationComponent implements OnInit {
  postForm!: FormGroup;

  fileToUpload: File | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  idcampagne = '';
  oneCampagne: any = null;
  isBusy = false;
  user: User = new User();

  postList: Post[] = [];
  isFacebookRequesting = false;

  @ViewChild(FBVideoComponent) video!: FBVideoComponent;

  pageObject: any = null;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private activeRoute: ActivatedRoute,
    private campagneService: CampagneService,
    private postService: PostService,
    private FB: FacebookService
  ) {
    let initParams: any = {
      appId: '1716043362189210',
      xfbml: true,
      //status: true,
      cookie: true,
      secret: '25e4d9f53a2a8f573fa80834b2010772',
      autoLogAppEvents: true,
      version: 'v17.0',
    };

    this.FB.init(initParams).then((data: any) => {
      console.log(data);
    });
    /*this.FB.getLoginStatus().then((response: any) => {
      console.log(response);
    });
    this.FB.api('https://graph.facebook.com/v17.0/'+ environment.faceBook.pageId +'/videos?access_token='+environment.faceBook.pageToken)
    .then(res => console.log('vidéos listes ===>', res))
    .catch(e => console.log(e));*/
  }

  ngOnInit(): void {
    this.postService
      .checkUser()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.pageObject = data;
        console.log('user facebook ===> ', this.pageObject);

        /*this.postService
            .testPublication(data.data[0].id, data.data[0].access_token)
            .pipe(take(1))
            .subscribe((dataMessage: any) => {
              console.log("message facebook ===> ", dataMessage);
            });

            const formData = new FormData();
            formData.append('Content-Type', 'multipart/form-data');
            // formData.append('file', filePhoto as File);
            formData.append('source', this.fileToUpload as File);
            formData.append('title', this.postForm.get('content')?.value);
            this.postService.postVideo(data.data[0].id, data.data[0].access_token, formData).subscribe(
              (dataPost: any) => {
                console.log('Post réponse!', dataPost);
              },
              (error: HttpErrorResponse) => {
                this.toastr.error('Erreur système lors de la publication de la vidéo !');
                this.isFacebookRequesting = false;
              }
            );*/
      });
    this.idcampagne = this.activeRoute.snapshot.params['idcampagne'];
    this.makeForm();
    this.sharedService.getUser().then((data: any) => {
      console.log(data);
      if (data) {
        this.user = data != '' ? data : null;
        this.makeForm();

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
              this.makeForm();
            });

          this.listPublication();
        }
      }
    });
  }

  listPublication(): void {
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
          this.postList = data;
        });
    }
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }
  /* gestion des pièces */

  choisirFichierVideo(): void {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/x-m4v,video/mpg,video/mpeg';
    input.onchange = (e) => {
      //var file = e.target?.files[0];
      this.handleFileInput(e);
    };

    input.click();
  }

  handleFileInput(event: any) {
    if (event.target.files[0] && event.target.files[0]?.size <= 20971520) {
      this.fileToUpload = event.target.files[0];
      console.log(this.fileToUpload?.name);
      // this.saveUpload();
    } else {
      this.toastr.error('Taille de la vidéo trop grande.');
    }
  }

  deleteUplod(): void {
    const videoId = this.postForm.get('video_id')?.value;
    this.isFacebookRequesting = true;
    this.postService
      .deleteVideo(this.pageObject.data[0].access_token, videoId)
      .subscribe(
        (data: any) => {
          console.log('Pièce réponse!', data);
          this.toastr.success('vidéo annulée');
          this.postForm.get('video_id')?.setValue(null);
          this.isFacebookRequesting = false;
        },
        (error: HttpErrorResponse) => {
          this.isFacebookRequesting = false;
          this.toastr.error('Erreur système !');
        }
      );
  }

  resetUplod(): void {
    this.fileToUpload = null;
  }

  saveUpload = async () => {
    if (this.fileToUpload != null) {
      this.isFacebookRequesting = true;
      this.postForm.get('video_id')?.setValue(null);
      const formData = new FormData();
      formData.append('Content-Type', 'multipart/form-data');
      // formData.append('file', filePhoto as File);
      formData.append('source', this.fileToUpload as File);
      formData.append('title', this.postForm.get('content')?.value);
      //envoyer le fichier vidéo sur la page facebook
      this.postService
        .postVideo(
          this.pageObject.data[0].id,
          this.pageObject.data[0].access_token,
          formData
        )
        .subscribe(
          (data: any) => {
            console.log('Pièce réponse!', data);
            //this.toastr.success('success !');
            this.postForm.get('video_id')?.setValue(data?.id);
            this.isFacebookRequesting = false;
            this.sendPost();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              'Erreur système lors de la publication de la vidéo !'
            );
            this.isFacebookRequesting = false;
          }
        );
    } else {
      this.toastr.error('Formulaire invalid.');
    }
  };
  /* fin gestion des pièces */

  backToPrevious(): void {
    this.router.navigate([
      '/back-office/campagne-publication/' + this.idcampagne,
    ]);
  }

  makeForm(): void {
    this.postForm = this.fb.group({
      idcampagne: [
        this.oneCampagne != null ? this.oneCampagne.id : null,
        [Validators.required],
      ],
      titrecamapagne: [
        this.oneCampagne != null ? this.oneCampagne.title : null,
        [Validators.required],
      ],
      mediaLink: [''],
      content: ['', [Validators.required]],
      video_id: [null],
      postedBy: [this.user && this.user.id ? this.user : null],
      mois: [(new Date().getMonth() + 1).toString()],
      annee: [new Date().getFullYear().toString()],
    });
  }

  sendPost(): void {
    const formData = this.postForm.value;
    this.isBusy = true;
    if (this.user && this.user.id) {
      if (this.postForm.valid) {
        formData.postedBy = this.user;
        this.postService.addPost(formData);
        this.campagneService.updateNombrePublicationCampagne(
          this.idcampagne,
          1
        );
        this.toastr.success('Publication effectuée avec succès');
        this.makeForm();
        this.isBusy = false;
        this.fileToUpload = null;
        this.listPublication();
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
