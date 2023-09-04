import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  setDoc,
  where,
  query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Gagnant } from '../models/gagnant';

@Injectable({
  providedIn: 'root'
})
export class GagnantService {

  constructor(private firestore: Firestore) {}
  // Create Gagnant
  addGagnant(gagnant: any) {
    const gagnantsRef = collection(this.firestore, 'gagnants');
    return addDoc(gagnantsRef, {
      content: gagnant.content,
      mediaLink: gagnant.mediaLink,
      user: gagnant.user,
      idcampagne: gagnant.idcampagne,
      titrecamapagne:  gagnant.titrecamapagne,
      mois: gagnant.mois,
      annee: gagnant.annee,
      postedAt: new Date(),
      postedBy: gagnant.postedBy
    });
  }

  // Fetch Gagnants List
  getGagnantsList(): Observable<any[]> {
    const gagnantsRef = collection(this.firestore, 'gagnants');
    return collectionData(gagnantsRef, { idField: 'id' }) as Observable<
      Gagnant[]
    >;
  }

  getGagnantsListByIdCampagne(id: string): Observable<any[]> {
    const gagnantsRef = collection(this.firestore, 'gagnants');
    const query1 = query(gagnantsRef, where('idcampagne', '==', id));
    return collectionData(query1, { idField: 'id' }) as Observable<
      Gagnant[]
    >;
  }

  // Update Gagnant Object
  getGagnantByID(id: string) {
    const gagnantsRef = doc(this.firestore, `gagnants/${id}`);
    return docData(gagnantsRef, { idField: 'id' }) as Observable<Gagnant>;
  }

  updateBook(gagnant: any) {
    const bookDocRef = doc(this.firestore, `gagnants/${gagnant.id}`);
    return setDoc(bookDocRef, {
      content: gagnant.content,
      mediaLink: gagnant.mediaLink,
      user: gagnant.user,
      idcampagne: gagnant.idcampagne,
      titrecamapagne:  gagnant.titrecamapagne,
      mois: gagnant.mois,
      annee: gagnant.annee,
      postedAt: new Date(),
      postedBy: gagnant.postedBy
    }, {merge: true});
  }
  // Delete Gagnant Object
  deleteGagnant(gagnant: Gagnant) {
    const articleDocRef = doc(this.firestore, `gagnants/${gagnant.id}`);
    return deleteDoc(articleDocRef);
  }

}
