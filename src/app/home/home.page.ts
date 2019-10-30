import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuController, IonSlides, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpazaService } from '../services/spaza.service';
import { database } from 'firebase';
import { Router } from '@angular/router';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', { static: false }) mapNativeElement: ElementRef;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  map: any;
  geocoder: any;
  spazalist;
  spazaload;

  startPosition: any;
  originPosition: string;
  destinationPosition: string;

  value: any;
  isSlide: boolean = true;
  lat;
  lng;

  isDirection;
  start;
  geojson: any = {};
  OBJ;
  plotLng: string;
  plotLat: string;
  coords: string;
  constructor(
    private launchNavigator: LaunchNavigator,
    public menuCtrl: MenuController,
    private authService: AuthService,
    public geolocation: Geolocation,
    public spazaService: SpazaService,
    private route: Router,
    public loadingCtrl: LoadingController
  ) {

    spazaService.getSpazas().subscribe((data) => {
      this.spazalist = data;
      this.spazaload = data;
    })

    this.geolocation.getCurrentPosition()
      .then((response) => {

        this.startPosition = response.coords;
        this.plotLat = this.startPosition.latitude;
        this.plotLng = this.startPosition.longitude;

      })
  }


  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  
  navigate(shop) {
    console.log("** launch Navigator **")

    this.launchNavigator.navigate([shop.lat, shop.lng], {
      start: this.coords
    })
      .then(
        success => console.log("launch Navigator successful " + success),
        error => console.log("error in launch Navigator  " + error)
      );

  }

  ionViewDidEnter() {
    //   const loading = this.loadingCtrl.create({
    //   message: 'Signing in, Please wait...',
    // });
    // (await loading).present();
    this.initializeMapBox();
    this.slideChanged();
  }

  initializeItems(): void {
    this.spazalist = this.spazaload;
  }

  initializeMapBox() {
    // or "const mapboxgl = require('mapbox-gl');"
    mapboxgl.accessToken = 'pk.eyJ1Ijoibm51bnUiLCJhIjoiY2p4cTIxazB3MG0wYTNncm4wanF0cDVjaiJ9.v0khvZZss9z_U2MroA2PVQ';
    this.map = new mapboxgl.Map({
      container: this.mapNativeElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 10,
      // center: [lng, lat],
      center: [28.218370, -25.731340]
    });

    this.geocoder = new MapboxGeocoder({ // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: {
        color: 'orange'
      },
      placeholder: 'Search for places ', // Placeholder text for the search bar
      // Coordinates of UC Berkeley
    });


    this.map.addControl(this.geocoder);

    this.geocoder.on('result', (ev) => {
      console.log(ev.result.text)
      this.value = ev.result.text;
      this.search(ev.result.text)
      console.log("valu ll" + this.value)
      console.log("me")
      // map.getSource('single-point').setData(ev.result.geometry);

    });

    this.geolocation.getCurrentPosition()
      .then((response) => {
console.log("jjj" + response.timestamp )
        this.startPosition = response.coords;
        // this.originPosition= response.Address;
        this.map.setCenter([this.startPosition.longitude, this.startPosition.latitude]);

        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(assets/img/icon.jpg)';
        el.style.width = '40px';
        el.style.height = '40px';

        var marker = new mapboxgl.Marker(el)
          .setLngLat([this.startPosition.longitude, this.startPosition.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML('<p>' + 'You are here' + '</p> '))
          .addTo(this.map);
      })


    // load coodinates from database
    this.spazaService.getSpazas().subscribe((markers: any) => {
      markers.forEach(element => {

        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(assets/img/icons8.png)';
        el.style.width = '40px';
        el.style.height = '40px';

        console.log(element.lng, element.lat)
        var marker = new mapboxgl.Marker(el)
          .setLngLat([element.lng, element.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<p>' + element.Address + '</p> <p>Spaza Name: ' + element.spazaName + '</p>'))
          .addTo(this.map);
      });
    })


  }

  search(evt) {
    console.log("val " + evt)
    this.initializeItems();

    const searchTerm = evt;

    if (!searchTerm) {
      return;
    }

    this.spazalist = this.spazalist.filter(currentSpaza => {
      if ((currentSpaza.spazaName && searchTerm) || (currentSpaza.Address && searchTerm)) {
        if ((currentSpaza.spazaName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentSpaza.Address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });

  }

  comment(spaza) {
    this.route.navigate(['/comment'], { queryParams: { spazauid: spaza.uid, spazaName: spaza.spazaName } });
  }


  slideChanged() {
    this.slides.startAutoplay();
  }
}
