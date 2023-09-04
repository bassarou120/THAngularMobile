import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  query,
  increment,
  FieldValue,
  setDoc,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Campagne } from '../models/campagne';

@Injectable({
  providedIn: 'root'
})
export class CampagneService {

  constructor(private firestore: Firestore) {}
  // Create Campagne
  addCampagne(campagne: any) {
    const contriesRef = collection(this.firestore, 'campagnes');
    return addDoc(contriesRef, {
      title: campagne.title,
      content: campagne.content,
      postedBy: campagne.postedBy,
      postedAt: new Date(),
      limitedAt: campagne.limitedAt,
      status: 'EN COURS',
      annee: campagne.annee,
      mois: campagne.mois,
      visibilite: campagne.visibilite,
      userList: campagne.userList,
      usersIds: campagne.usersIds,
      countryId: campagne.countryId,
      nombreGagnant: 0,
      nombrePublication: 0
    });
  }

  activatedOrLockedCampagne(id: any, status: string) {
    const bookDocRef = doc(this.firestore, `campagnes/${id}`);
    return setDoc(
      bookDocRef,
      {
        status: status,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  // Fetch Campagnes List
  getCampagnesList(): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'campagnes');
    return collectionData(contriesRef, { idField: 'id' }) as Observable<
      Campagne[]
    >;
  }

  getCampagnesListSentForUser(id: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'campagnes');
    const query1 = query(contriesRef, where('usersIds', 'array-contains', id));
    return collectionData(query1, { idField: 'id' }) as Observable<Campagne[]>;
  }

  getCampagnesListEnCours(id: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'campagnes');
    const query1 = query(contriesRef, where('status', '==', 'EN COURS'));
    const query2 = query(query1, where('usersIds', 'array-contains', id));
    return collectionData(query2, { idField: 'id' }) as Observable<Campagne[]>;
  }

  // Update Campagne Object
  getCampagneByID(id: string) {
    const contriesRef = doc(this.firestore, `campagnes/${id}`);
    return docData(contriesRef, { idField: 'id' }) as Observable<Campagne>;
  }

  updateCampagne(campagne: any) {
    const bookDocRef = doc(this.firestore, `campagnes/${campagne.id}`);
    return setDoc(bookDocRef, {
      status: campagne.status,
      postedBy: campagne.postedBy,
      updatedAt: new Date()
    }, {merge: true});
  }

  updateNombreGagnantCampagne(id: string, i: number) {
    const bookDocRef = doc(this.firestore, `campagnes/${id}`);
    return setDoc(bookDocRef, {
      nombreGagnant: increment(i),
      updatedAt: new Date()
    },
    { merge: true });
  }

  updateNombrePublicationCampagne(id: string, i: number) {
    const bookDocRef = doc(this.firestore, `campagnes/${id}`);
    return setDoc(bookDocRef, {
      nombrePublication: increment(i),
      updatedAt: new Date()
    },
    { merge: true });
  }

  // Delete Campagne Object
  deleteCampagne(campagne: Campagne) {
    const campagneDocRef = doc(this.firestore, `campagnes/${campagne.id}`);
    return deleteDoc(campagneDocRef);
  }

}
