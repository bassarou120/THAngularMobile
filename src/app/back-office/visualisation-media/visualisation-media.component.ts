import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gagnant } from 'src/app/models/gagnant';
import { GagnantService } from 'src/app/services/gagnant.service';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-visualisation-media',
  templateUrl: './visualisation-media.component.html',
  styleUrls: ['./visualisation-media.component.css'],
})
export class VisualisationMediaComponent implements OnInit {


  idgagnant: string = '';
  i: number = 0;

  @Input() oneGagnant: Gagnant = new Gagnant();

  @Input() onPost: Post = new Post();

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private gagnantService: GagnantService,
    private activeRoute: ActivatedRoute,
    private postService: PostService,
  ) { }

  ngOnInit(): void {

    this.i = this.activeRoute.snapshot.params['i'];
    this.idgagnant = this.activeRoute.snapshot.params['id'];
    if(this.i == 0 || this.i == 1) {

      if (this.idgagnant != undefined && this.idgagnant != '' && this.idgagnant != null) {
        this.gagnantService.getGagnantByID(this.idgagnant).pipe(take(1)).subscribe(
          (data: any) => {
            console.log(data);
            this.oneGagnant = data;
          });
      }
    }

    if(this.i == 2 || this.i == 3 || this.i == 4) {
      if (this.idgagnant != undefined && this.idgagnant != '' && this.idgagnant != null) {
        console.log('this.idgagnant', this.idgagnant);
      this.postService.getPostByID(this.idgagnant).pipe(take(1)).subscribe(
        (data: any) => {
          console.log(data);
          this.onPost = data;
        });
      }
    }
  }

  backToPrevious(): void {
    if(this.i == 0) {
      this.router.navigate(['/back-office/gerer-gagnant/'+this.oneGagnant.idcampagne]);
    }
    if(this.i == 1) {
      this.router.navigate(['/back-office/gagnant']);
    }
    if(this.i == 2) {
      this.router.navigate(['/back-office/campagne-publication']);
    }
    if(this.i == 3) {
      this.router.navigate(['/back-office/campagne-publication/'+this.onPost.idcampagne]);
    }
    if(this.i == 4) {
      this.router.navigate(['/back-office/liste-campagne/'+this.onPost.idcampagne]);
    }
  }

  isYoutubeLink(url: string): boolean {
    if(url.indexOf("youtube") > -1) {
      return true;
    }
    return false;
  }


  isFacebookLink(url: string): boolean {
    if(url.indexOf("facebook") > -1) {
      return true;
    }
    return false;
  }

  getMonthOfNumer(i: string): string {
    return this.sharedService.getMonthByNumeroMois(i);
  }

}
