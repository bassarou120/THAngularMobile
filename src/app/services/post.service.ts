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
  setDoc,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: Firestore,
    private http: HttpClient) {}
  // Create Campagne
  addPost(post: any) {
    const contriesRef = collection(this.firestore, 'posts');
    return addDoc(contriesRef, {
      content: post.content,
      postedBy: post.postedBy,
      postedAt: new Date(),
      mediaLink: post.mediaLink,
      idcampagne: post.idcampagne,
      annee: post.annee,
      mois: post.mois,
      status: 'POSTÉ',
      video_id: post.video_id,
      titrecamapagne: post.titrecamapagne
    });
  }

  activatedOrLockedPost(id: any, status: string) {
    const bookDocRef = doc(this.firestore, `posts/${id}`);
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
  getPostList(): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'posts');
    return collectionData(contriesRef, { idField: 'id' }) as Observable<
      Post[]
    >;
  }

  getPostListByStatut(status: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'posts');
    const query1 = query(contriesRef, where('status', '==', status));
    return collectionData(query1, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostListByStatutAndCampagne(status: string, idcampagne: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'posts');
    const query1 = query(contriesRef, where('status', '==', status));
    const query2 = query(query1, where('idcampagne', '==', idcampagne));
    return collectionData(query2, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostListSentForUser(id: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'posts');
    const query1 = query(contriesRef, where('postedBy.id', '==', id));
    return collectionData(query1, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostListSentForUserByCampagne(id: string, idcampagne: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'posts');
    const query1 = query(contriesRef, where('postedBy.id', '==', id));
    const query2 = query(query1, where('idcampagne', '==', idcampagne));
    return collectionData(query2, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostListByCampagneId(id: string): Observable<any[]> {
    const contriesRef = collection(this.firestore, 'posts');
    const query1 = query(contriesRef, where('idcampagne', '==', id));
    return collectionData(query1, { idField: 'id' }) as Observable<Post[]>;
  }

  // Update Campagne Object
  getPostByID(id: string) {
    const contriesRef = doc(this.firestore, `posts/${id}`);
    return docData(contriesRef, { idField: 'id' }) as Observable<Post>;
  }

  // Delete Campagne Object
  deletePost(post: Post) {
    const campagneDocRef = doc(this.firestore, `posts/${post.id}`);
    return deleteDoc(campagneDocRef);
  }

  postVideo(pageId: any, access_token: any, paylod: any): Observable<Object> {
    return this.http.post(`${environment.faceBook.host}/${pageId}/videos?access_token=${access_token}`, paylod);
  }

  deleteVideo(access_token: any, videoId: any): Observable<Object> {
    return this.http.delete(`${environment.faceBook.host}/${videoId}?access_token=${access_token}`);
  }

  checkUser(): Observable<Object> {
    return this.http.get(`https://graph.facebook.com/${environment.faceBook.userId}/accounts?access_token=${environment.faceBook.userToken}`);
  }

  testPublication(pageId: any, access_token: any): Observable<Object> {
    // return this.http.post(`${environment.faceBook.host}/${environment.faceBook.pageId}/videos?access_token=${environment.faceBook.pageToken}`, paylod);
    return this.http.post(`${environment.faceBook.host}/${pageId}/feed?published=false&message=Hello World!&access_token=${access_token}`, null);
   }

}
