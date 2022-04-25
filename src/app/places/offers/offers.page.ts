import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offerPlace: Place[] = [];
  loading: boolean;
  private placesSub: Subscription;

  constructor(private placeService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places) => {
      this.offerPlace = places;
    });
  }

  ionViewWillEnter() {
    this.loading = true;
    this.placeService.fetchPlaces().subscribe(() => {
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl('/places/tabs/offers/edit/' + offerId);
  }
}
