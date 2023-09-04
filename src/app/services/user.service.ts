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
  where,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';

import * as sha512 from 'js-sha512';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  //connexion
  singin(payload: any): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const query1 = query(
      usersRef,
      where('email', '==', payload.email),
      where('password', '==', sha512.sha512(payload.password))
    );
    return collectionData(query1, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersByEmail(email: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const query1 = query(usersRef, where('email', '==', email));
    return collectionData(query1, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersByPhoneNumber(countryCodePhone: string, phoneNumber: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const query1 = query(usersRef, where('country.codePhone', '==', countryCodePhone), where('phoneNumber', '==', phoneNumber));
    return collectionData(query1, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersByPassword(password: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const query1 = query(
      usersRef,
      where('password', '==', sha512.sha512(password))
    );
    return collectionData(query1, { idField: 'id' }) as Observable<User[]>;
  }

  changeUserPassword(id: any, password: string) {
    const bookDocRef = doc(this.firestore, `users/${id}`);
    return setDoc(
      bookDocRef,
      {
        password: sha512.sha512(password),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  activatedOrLockedUser(id: any, status: string) {
    const bookDocRef = doc(this.firestore, `users/${id}`);
    return setDoc(
      bookDocRef,
      {
        status: status,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  changerUserRole(id: any, status: string) {
    const bookDocRef = doc(this.firestore, `users/${id}`);
    return setDoc(
      bookDocRef,
      {
        role: status,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  annulerCodeVerification(id: any) {
    const bookDocRef = doc(this.firestore, `users/${id}`);
    return setDoc(
      bookDocRef,
      {
        codeVerification: null,
        isCodeSent: true,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  reinitialisationPasswordUser(id: any, dataUserPassword: any) {
    const bookDocRef = doc(this.firestore, `users/${id}`);
    return setDoc(
      bookDocRef,
      {
        codeVerification: dataUserPassword.codeVerification,
        password: sha512.sha512(dataUserPassword.password),
        isCodeSent: false,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  // Create User
  addUser(user: any) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      country: user.country,
      email: user.email,
      password: sha512.sha512(user.password),
      role: 'ABONNÉ',
      codeVerification: user.codeVerification,
      createdAt: new Date(),
      status: 'ACTIF'
    });
  }

  // Fetch Users List
  getUsersList(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }

  // Update User Object
  getUserByID(id: string) {
    const usersRef = doc(this.firestore, `users/${id}`);
    return docData(usersRef, { idField: 'id' }) as Observable<User>;
  }

  updateUser(user: any) {
    const bookDocRef = doc(this.firestore, `users/${user.id}`);
    return setDoc(
      bookDocRef,
      {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        country: user.country,
        email: user.email,
        updatedAt: new Date(),
        sexe: user.sexe,
        birthDay: new Date(user.birthDay),
        birthCity: user.birthCity,
        profession: user.profession,
      },
      { merge: true }
    );
  }
  // Delete User Object
  deleteUser(user: User) {
    const articleDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(articleDocRef);
  }
}
