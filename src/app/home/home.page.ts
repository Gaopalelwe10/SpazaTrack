import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuController, IonSlides, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpazaService } from '../services/spaza.service';
import {HttpClient} from '@angular/common/http'
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
  geojson : any = {};
  OBJ ;
  tempDur;
  distance;
  duration;
  text;
  finalDistance;
  finalDuration;
  steps : any = [];
  jotPos : any = [];
  plotLng;
  plotLat;
  constructor(
    private launchNavigator: LaunchNavigator, 
    private http : HttpClient,
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

  }


  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  navigate(){
    console.log("**")

    this.geolocation.getCurrentPosition()
      .then((response) => {

        this.startPosition = response.coords;
        // this.originPosition= response.Address;
        this.map.setCenter([this.startPosition.longitude, this.startPosition.latitude]);
        this.plotLat = this.startPosition.latitude;
        this.plotLng = this.startPosition.longitude;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(assets/img/icon.jpg)';
        el.style.width = '40px';
        el.style.height = '40px';

        var marker = new mapboxgl.Marker(el)
          .setLngLat([this.startPosition.longitude, this.startPosition.latitude])
          // .setPopup(new mapboxgl.Popup({ offset: 25 })
          //   .setHTML('<p>' + this.startPosition.Address + '</p> '))
          .addTo(this.map);
      })
      console.log(this.plotLng+" && "+this.plotLat)
    this.launchNavigator.navigate([50.279306, -5.163158], {
      start: "50.342847, -4.749904"
  });
  //   launchavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS, function(isAvailable){
  //     var app;
  //     if(isAvailable){
  //         app = this.launchNavigator.APP.GOOGLE_MAPS;
  //     }else{
  //         console.warn("Google Maps not available - falling back to user selection");
  //         app = this.launchNavigator.APP.USER_SELECT;
  //     }
  //     this.launchNavigator.navigate("London, UK", {
  //         app: app
  //     });
  // });
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


           //  TrackUser current location

           this.map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true
            }),'top-left');
    
             // Add zoom and rotation controls to the map.
          this.map.addControl(new mapboxgl.NavigationControl(),'top-left');
    

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
          // .setPopup(new mapboxgl.Popup({ offset: 25 })
          //   .setHTML('<p>' + this.startPosition.Address + '</p> '))
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
  trackShop(shop) {
    
    this.lat = shop.lat;
    this.lng = shop.lng;
    
    var coords = [this.lng, this.lat]
    this.getRoute(coords);
    console.log(this.lng);
    console.log(this.lat);
    this.map.setCenter([this.lng, this.lat]);
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/img/pin.png)';
    el.style.width = '40px';
    el.style.height = '40px';
    var marker = new mapboxgl.Marker(el)
      .setLngLat([this.lng, this.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<p>' + shop.Address + '</p> <p>Spaza Name: ' + shop.spazaName + '</p>'))
      .addTo(this.map);


      
      
      // var end = {
      //   type: 'FeatureCollection',
      //   features: [{
      //     type: 'Feature',
      //     properties: {},
      //     geometry: {
      //       type: 'Point',
      //       coordinates: coords
      //     }
      //   }
      //   ]
      // };
      // if (this.map.getLayer('end')) {
      //   this.map.getSource('end').setData(end);
      // } else {
      //   this.map.addLayer({
      //     id: 'end',
      //     type: 'circle',
      //     source: {
      //       type: 'geojson',
      //       data: {
      //         type: 'FeatureCollection',
      //         features: [{
      //           type: 'Feature',
      //           properties: {},
      //           geometry: {
      //             type: 'Point',
      //             coordinates: coords
      //           }
      //         }]
      //       }
      //     },
      //     paint: {
      //       'circle-radius': 10,
      //       'circle-color': '#f30'
      //     }
      //   });
      // }
     
  }

  getRoute(end) {
    // make a directions request using cycling profile
    
    // only the end or destination will change
    
    // an arbitrary start will always be the same
    this.isDirection = true ;
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/img/icon.jpg)';
    el.style.width = '40px';
    el.style.height = '40px';
  
  
    this.geolocation.getCurrentPosition()
    .then((response) => {
      console.log(response)
      this.startPosition = response.coords;
      // this.map.setCenter([this.startPosition.longitude, this.startPosition.latitude]);
      console.log(this.startPosition)
      this.start = [this.startPosition.longitude,this.startPosition.latitude];
      var marker = new mapboxgl.Marker(el)
        .setLngLat([this.startPosition.longitude, this.startPosition.latitude])
        .addTo(this.map);
    })
  
    // var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + this.start[0] + ',' + this.start[1] + ';' + this.end1[0] + ',' + this.end1[1] + '?steps=true&geometries=geojson&access_token=' + 'pk.eyJ1Ijoibm51bnUiLCJhIjoiY2p4cTIxazB3MG0wYTNncm4wanF0cDVjaiJ9.v0khvZZss9z_U2MroA2PVQ';
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + this.start[0] + ',' + this.start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + 'pk.eyJ1Ijoibm51bnUiLCJhIjoiY2p4cTIxazB3MG0wYTNncm4wanF0cDVjaiJ9.v0khvZZss9z_U2MroA2PVQ';
  
  
    var req = this.http.get(url).subscribe((response) => {
      this.OBJ = response;
      this.tempDur = this.OBJ.routes[0].legs[0];
      this.distance = this.OBJ.routes[0].legs[0].distance;
      this.duration = this.OBJ.routes[0].legs[0].duration;
      this.steps = this.OBJ.routes[0].legs[0].steps;
      console.log( (this.distance / 1000).toFixed(1) + " KM");
      console.log( (this.duration / 60).toFixed(2) + " Mins");
      console.log(this.steps);
      var data = this.OBJ.routes[0];
      var route = data.geometry.coordinates;
      console.log(route);
      console.log(this.OBJ);
      this.geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          };
    });
  
    this.finalDuration =(this.tempDur.duration / 60).toFixed(2);
    this.finalDistance =(this.tempDur.distance / 1000).toFixed(2);
    // // if the route already exists on the map, reset it using setData
  
  
      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(this.geojson);
      } else { // otherwise, make a new request
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: this.geojson
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      
  
        
  
      // add turn instructions here at the end
  
      // get the sidebar and add the instructions
  var instructions = document.getElementById('instructions');
  // var steps = this.OBJ.route[0].legs[0].steps;
  
  var tripInstructions = [];
  for (var i = 0; i < this.steps.length; i++) {
   console.log(i + " -- " + this.steps[i].maneuver.instruction) ;
    // instructions.innerHTML = '<br><span class="duration">Trip duration: ' + Math.floor(this.OBJ.duration / 60) + ' min 🚴 </span>' + tripInstructions;
  }
  this.text = tripInstructions;
  
    };
    // // req.send();
    // // this.http
  }
  jotPip(xx){

    this.finalDuration =(this.tempDur.duration / 60).toFixed(2);
    this.finalDistance =(this.tempDur.distance / 1000).toFixed(2);
    console.log(xx)
    console.log((this.tempDur.duration / 60).toFixed(2) + " Mins")
    console.log((this.tempDur.distance / 1000).toFixed(2)  + " KM")
    console.log(xx.intersections[0].location)
    this.jotPos = xx.intersections[0].location;
    this.map.flyTo({
      center : [this.jotPos[0],this.jotPos[1]],
      zoom : 15
    })

    var marker = new mapboxgl.Marker();

      marker.setLngLat([this.jotPos[0], this.jotPos[1]])
      .addTo(this.map);
    // this.map.addLayer({
    //     id: 'point',
    //     type: 'circle',
    //     source: {
    //       type: 'geojson',
    //       data: {
    //         type: 'FeatureCollection',
    //         features: [{
    //           type: 'Feature',
    //           properties: {},
    //           geometry: {
    //             type: 'Point',
    //             coordinates: this.jotPos
    //           }
    //         }
    //         ]
    //       }
    //     },
    //     paint: {
    //       'circle-radius': 10,
    //       'circle-color': '#3887be'
    //     }
    //   });
    // this.map.setCenter([this.jotPos[0],this.jotPos[1]]);
    //  this.map = new mapboxgl.Map({
    //   container: this.mapNativeElement.nativeElement,
    //   zoom : 25,
    //   center : [this.jotPos[0],this.jotPos[1]]
    // });
  }
  directionClose(){
    console.log("**")
    // document.getElementById("close").style.display = "none";
    this.isDirection = false ;
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
