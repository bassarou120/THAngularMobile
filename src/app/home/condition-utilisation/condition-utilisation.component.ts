import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-condition-utilisation',
  templateUrl: './condition-utilisation.component.html',
  styleUrls: ['./condition-utilisation.component.css']
})
export class ConditionUtilisationComponent implements OnInit {

  i = 0;
  dateNow = new Date();

  @Input() isHome = true;

  constructor(
     private router: Router
  ) { }

  ngOnInit(): void {
  }

  homeBack(): void {
    this.router.navigate(['/']);
  }

  makeTabChoice(value: number): void {
    this.i = value;
  }

  async ouvrirLink(url: string): Promise<void> {
    /*if (this.oneCampagne != null) {
      this.router.navigate(['/back-office/visualisation/3/' + this.onPost?.id]);
    } else {
      this.router.navigate(['/back-office/visualisation/2/' + this.onPost?.id]);
    }
    https://web.facebook.com/watch/?v=964256954579938
    */
      await Browser.open({ url: url });
  }

}
