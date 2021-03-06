import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PopoverController, ModalController } from '@ionic/angular';
import { PopoverPage } from '../popover/popover.page';
import { AddcommentPage } from '../addcomment/addcomment.page';
import { ProductlistcustomerPageModule } from '../productlistcustomer/productlistcustomer.module';
import { ProductlistcustomerPage } from '../productlistcustomer/productlistcustomer.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
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
  tellus;
  
  spazauid: string;
  spazaName: string;
  uid: any;
  users: any;



  isRate:boolean=false;
  isLoadComments="true";

  Recent:boolean=false;

  ItemsList;
  ItemslistR
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private popoverController: PopoverController,
    public modalController: ModalController,
    private Viewer: PhotoViewer,
    ) {

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
    this.commentsRef.snapshotChanges().subscribe(data =>{

      this.ItemsList=data.map(e =>{
        return{
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as comment;
      });
      console.log(this.ItemsList);
    })
   
  }
  async onModelChange(ev) {
    const modal = await this.modalController.create({
      component: AddcommentPage,
      componentProps:{
        rate:ev,
        spazauid: this.spazauid,
      },
    });
    this.rate = 0;
    return await modal.present();

  }

  addComment() {
    this.isRate=false;
    this.commentsRef.add({ content: this.text, rate: this.rate, createdAt: Date.now(), uid: this.uid })
    this.text = '';
    this.rate = 0
   
  }

  // Lazy Load the Firestore Collection
  loadMore() {
    this.isLoadComments="false";
    this.Recent=true;
    
  }

  loadRecentComments(){
    this.isLoadComments="true";
    this.Recent=false;
  }
  
  zoom(url) {
    this.Viewer.show(url.photoURL, url.spazaName, { share: true, copyToReference: true });
  }

  async openPopover(ev: any ,  comment){
    const popover= await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      componentProps:{
        comment:  comment,
        spazauid: this.spazauid,
      },
      translucent: true
    });
    return await popover.present();
  }
  async productlist(){
    const modal = await this.modalController.create({
      component: ProductlistcustomerPage,
      componentProps:{
        spazauid: this.spazauid,
      },
    });
   
    return await modal.present();
  }
}
