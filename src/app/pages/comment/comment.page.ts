import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {
  spazaRef: AngularFirestoreDocument<any>;
  spaza$: Observable<any>;

  commentsRef: AngularFirestoreCollection<any>;
  comments$: Observable<any>;

  text: string;
  rate = 0;
  spazauid: string;
  spazaName: string;
  uid: any;
  users: any;
  tellus;
  isRate:boolean=false;
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth,
    private authService: AuthService) {

    this.uid = this.afAuth.auth.currentUser.uid;
  
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.spazauid = params.spazauid;
        this.spazaName=params.spazaName;
        
        console.log("user " + this.spazauid);

      });

    this.spazaRef = this.afs.doc(`spazashop/${this.spazauid}`)
    // this.postRef = this.afs.doc('posts/testPost')
    this.commentsRef = this.spazaRef.collection('comments', ref => ref.orderBy('createdAt', 'desc'))
    this.spaza$ = this.spazaRef.valueChanges();
    this.users = this.afs.collection('users').valueChanges();
   
  }
  onModelChange(ev) {
    this.isRate=true;
    console.log(this.rate)
    if(this.rate== 3){
      this.tellus="Tell others why this place was okay";
    }else if(this.rate >3 && this.rate<=5){
      this.tellus="Tell others why you liked this place ";
    }else{
      this.tellus="Tell others why you disliked this place ";
    }
  }

  addComment() {
    this.isRate=false;
    this.commentsRef.add({ content: this.text, rate: this.rate, createdAt: Date.now(), uid: this.uid })
    this.text = '';
    this.rate = 0
  }

  // Lazy Load the Firestore Collection
  loadMore() {
    this.comments$ = this.commentsRef.valueChanges();
  }
}
