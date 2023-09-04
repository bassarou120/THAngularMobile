import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post';
import { User } from '../models/user';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  private loading: BehaviorSubject<boolean>;

  private postList: BehaviorSubject<Post[]>;

  constructor() {
    this.loading = new BehaviorSubject<boolean>(false);
    this.postList = new BehaviorSubject<Post[]>([]);
  }

  public setPostList(param: any): void {
    this.postList.next(param);
  }

  public getLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  public setLoading(param: any): void {
    this.loading.next(param);
  }

  public getPostList(): Observable<Object> {
    return this.postList.asObservable();
  }

  // JSON "set" example
  async setUser(user: any) {
    console.log('user ==>', user);
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(user),
    }).then(() => {}).catch((err) => {
      console.log(err);
    });
  }

  // JSON "get" example
  async getUser(): Promise<any> {
    const ret = await Preferences.get({ key: 'user' });
    const user = JSON.parse(ret.value ? ret.value : '{}');
    return user;
  }

  public getMonthByNumeroMois(num: string): string {
    let rep = '';
    switch (num) {
      case '1':
        rep = 'Janvier';
        break;
      case '2':
        rep = 'Février';
        break;
      case '3':
        rep = 'Mars';
        break;
      case '4':
        rep = 'Avril';
        break;
      case '5':
        rep = 'Mai';
        break;
      case '6':
        rep = 'Juin';
        break;
      case '7':
        rep = 'Juillet';
        break;
      case '8':
        rep = 'Août';
        break;
      case '9':
        rep = 'Septembre';
        break;
      case '10':
        rep = 'Octobre';
        break;
      case '11':
        rep = 'Novembre';
        break;
      case '12':
        rep = 'Décembre';
        break;
    }
    return rep;
  }
}
