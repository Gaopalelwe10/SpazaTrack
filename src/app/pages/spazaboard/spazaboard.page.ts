import { Component, OnInit } from '@angular/core';
import { SpazaService } from 'src/app/services/spaza.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spazaboard',
  templateUrl: './spazaboard.page.html',
  styleUrls: ['./spazaboard.page.scss'],
})

export class SpazaboardPage implements OnInit {
  spazalist;
  spazaload;
  noti = ''

  isSearchbar: boolean=false;
  constructor(private spazaService: SpazaService, private route: Router) {

    spazaService.getSpazas().subscribe((data) => {
      this.spazalist = data;
      this.spazaload = data;
    })
  }

  ngOnInit() {
  }
  initializeItems(): void {
    this.spazalist = this.spazaload;
  }
  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

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
    this.route.navigate(['/comment'], { queryParams: { spazauid: spaza.uid , spazaName: spaza.spazaName} });
  }

}
