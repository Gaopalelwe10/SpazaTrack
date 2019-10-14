import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { MustMatch } from 'src/app/module/must-match';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  register: FormGroup;

  constructor(private fb: FormBuilder,
    private afs :AngularFirestore, 
    private authService : AuthService, 
    private afAuth :AngularFireAuth, 
    private nav : NavController,
    private route : Router) {
    this.register = fb.group({
      username: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30), Validators.required])],
      // surname: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30),Validators.required])],
      address: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(12), Validators.required])],
      cpassword: ['', Validators.required]

    }, {
      validator: MustMatch('password', 'cpassword')
    });
  }

  ngOnInit() {
  }

  PersonRegister() {
    this.authService.signup(this.register.value.email,this.register.value.password ).then((value) => {
      this.afs.collection('users').doc(this.afAuth.auth.currentUser.uid).set({
        displayName:this.register.value.username,   
        uid: this.afAuth.auth.currentUser.uid,
        Timestamp:Date.now(),
        Email:this.register.value.email,
        Address:this.register.value.address,
        photoURL:'', 
        Registered:"no",
      }).then(()=>{
        
        this.nav.navigateRoot('home');
      }).catch(err=>{
        alert(err.message)
      })
    });
  }
  login(){
    this.route.navigateByUrl('login');
  }
}
