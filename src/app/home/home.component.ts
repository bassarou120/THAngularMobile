import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  accederCondition(): void {
    this.router.navigate(['/condition-utilisation']);
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
