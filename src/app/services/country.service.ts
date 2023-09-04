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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private firestore: Firestore) {}
  // Create Country
  addCountry(country: any) {
    const contriesRef = collection(this.firestore, 'countries');
    return addDoc(contriesRef, {
      name: country.name,
      codeCountry: country.codeCountry,
      codePhone: country.codePhone
    });
  }

  // Fetch Countrys List
  getCountrysList(): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'countries');
    return collectionData(contriesRef, { idField: 'id' }) as Observable<
      Country[]
    >;
  }

  // Update Country Object
  getCountryByID(id: string) {
    const contriesRef = doc(this.firestore, `countries/${id}`);
    return docData(contriesRef, { idField: 'id' }) as Observable<Country>;
  }

  updateBook(country: any) {
    const bookDocRef = doc(this.firestore, `countries/${country.id}`);
    return setDoc(bookDocRef, {
      name: country.name,
      codeCountry: country.codeCountry,
      codePhone: country.codePhone
    });
  }

  // Delete Country Object
  deleteCountry(country: Country) {
    const articleDocRef = doc(this.firestore, `countries/${country.id}`);
    return deleteDoc(articleDocRef);
  }

}
