import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpazaService } from '../services/spaza.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', { static: false }) mapNativeElement: ElementRef
  map: any;

  startPosition: any;
  originPosition: string;
  destinationPosition: string;

  constructor(public menuCtrl: MenuController, private authService: AuthService, public geolocation: Geolocation, public spazaService: SpazaService) { }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }


  ionViewDidEnter() {
    this.initializeMapBox();
    // this.loadAllmakers();
  }

  initializeMapBox() {


    // or "const mapboxgl = require('mapbox-gl');"
    mapboxgl.accessToken = 'pk.eyJ1Ijoibm51bnUiLCJhIjoiY2p4cTIxazB3MG0wYTNncm4wanF0cDVjaiJ9.v0khvZZss9z_U2MroA2PVQ';
    const map = new mapboxgl.Map({
      container: this.mapNativeElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 10,
      // center: [lng, lat],
      center: [28.218370, -25.731340]
    });

    // map.addControl(new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   marker: {
    //     color: 'orange'
    //   },
    //   mapboxgl: mapboxgl,

    // }));


    const geocoder = new MapboxGeocoder({ // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: {
        color: 'orange'
      },
      placeholder: 'Search for places ', // Placeholder text for the search bar
      // Coordinates of UC Berkeley
    });
    // map.addControl(new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   marker: {
    //     color: 'orange'
    //   },
    //   mapboxgl: mapboxgl,
    // }));
    map.addControl(geocoder)
    geocoder.on('result', function (ev) {
      console.log(ev.result.place_name)
      console.log("me")
      // map.getSource('single-point').setData(ev.result.geometry);
    });

    this.geolocation.getCurrentPosition()
      .then((response) => {
        this.startPosition = response.coords;
        map.setCenter([this.startPosition.longitude, this.startPosition.latitude]);

        var marker = new mapboxgl.Marker()
          .setLngLat([this.startPosition.longitude, this.startPosition.latitude])
          .addTo(map);
      })
    this.spazaService.getSpazas().subscribe((markers: any) => {
      markers.forEach(element => {

        // map.setCenter([element.lng, element.lat]);
        console.log(element.lng, element.lat)
        var marker = new mapboxgl.Marker()
          .setLngLat([element.lng, element.lat])
          .addTo(map);
      });
    })

  }
  loadAllmakers() {
    this.spazaService.getSpazas().subscribe((markers: any) => {
      markers.forEach(element => {
        console.log(element.lng, element.lat)
        var marker = new mapboxgl.Marker()
          .setLngLat([element.lng, element.lat])
          .addTo(this.map);
      });
    })
  }
}
