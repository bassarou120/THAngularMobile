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
  DocumentReference,
  setDoc,
  where,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Messagerie } from '../models/messagerie';

@Injectable({
  providedIn: 'root'
})
export class MessagerieService {

  constructor(private firestore: Firestore) {}
  // Create Messagerie
  addMessagerie(messagerie: any) {
    const messageriesRef = collection(this.firestore, 'messageries');
    return addDoc(messageriesRef, {
      type: messagerie.type,
      title: messagerie.title,
      content: messagerie.content,
      postedBy: messagerie.postedBy,
      status: 'Important',
      postedAt: new Date(),
      mois: messagerie.mois,
      annee: messagerie.annee,
      visibilite: messagerie.visibilite,
      userList: messagerie.userList,
      usersIds: messagerie.usersIds,
    });
  }

  replyMessage(messagerie: any) {
    const bookDocRef = doc(this.firestore, `messageries/${messagerie.id}`);
    return setDoc(bookDocRef, {
      replyList: messagerie.replyList,
      updatedAt: new Date()
    }, {merge: true});
  }

  // Fetch Messageries List
  getMessageriesList(): Observable<any[]> {
    const messageriesRef = collection(this.firestore, 'messageries');
    return collectionData(messageriesRef, { idField: 'id' }) as Observable<
      Messagerie[]
    >;
  }

  getMessageriesListByUser(id: string): Observable<any[]> {
    const messageriesRef = collection(this.firestore, 'messageries');
    const query1 = query(messageriesRef, where('usersIds', 'array-contains', id));
    return collectionData(query1, { idField: 'id' }) as Observable<Messagerie[]>;
  }


  getMessageriesListNonLuByUser(id: string): Observable<any[]> {
    const messageriesRef = collection(this.firestore, 'messageries');
    const query1 = query(messageriesRef, where('usersIds', 'array-contains', id));
    const query2 = query(query1, where('status', '==', "Non lu"));
    return collectionData(query2, { idField: 'id' }) as Observable<Messagerie[]>;
  }

  // Update Messagerie Object
  getMessagerieByID(id: string) {
    const messageriesRef = doc(this.firestore, `messageries/${id}`);
    return docData(messageriesRef, { idField: 'id' }) as Observable<Messagerie>;
  }

  updateStatus(id: string, status: string) {
    const bookDocRef = doc(this.firestore, `messageries/${id}`);
    return setDoc(bookDocRef, {
      status: status,
    }, {merge: true});
  }
  // Delete Messagerie Object
  deleteMessagerie(messagerie: Messagerie) {
    const articleDocRef = doc(this.firestore, `messageries/${messagerie.id}`);
    return deleteDoc(articleDocRef);
  }

}
