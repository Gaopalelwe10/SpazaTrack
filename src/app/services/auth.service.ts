import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  constructor(private afs: AngularFirestore, private nav: NavController, public afAuth: AngularFireAuth, private alertCtrl : AlertController ) { 
    afAuth.auth.onAuthStateChanged((user)=>{
      if(user){
        this.nav.navigateRoot("home");
      }else{
        this.nav.navigateRoot("");
      }
    })
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }

 
    
  async login(email: string , password: string){
    await this.afAuth.auth.signInWithEmailAndPassword(email,password).then((success)=>{
       console.log(success);
     }).catch((error)=>{
       this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: 'Wrong Password Or Email',
        buttons: ['Ok']}).then(
        alert=> alert.present()
      );
     })
   }
   
   async signup(email, password){
    await this.afAuth.auth.createUserWithEmailAndPassword(email,password).then((success)=>{
      console.log(success);
    }).catch((error)=>{
     console.log(error)
    })
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout(){
    await this.afAuth.auth.signOut().then((success)=>{
      console.log(success);
      console.log("success");
      this.nav.navigateRoot("login");
    }).catch((error)=>{
      console.log(error)
    })
  }

  getUsers(){
    return this.afs.collection('users', ref=>ref.orderBy('displayName')).valueChanges()
  }
  getUID(): string {
		return this.afAuth.auth.currentUser.uid;
  }
  updateRegistered(key,value){
    return this.afs.doc('users/'+ key).update({
      Registered: value,
    })
  }
}
