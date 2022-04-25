import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  preLoadedPlaces: Place[];
  relevantPlaces: Place[];

  loading: boolean;

  private placesSub: Subscription;

  constructor(
    private placeService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.preLoadedPlaces = this.relevantPlaces.slice(1);
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

  // ionViewWillEnter() {
  //   this.loadedPlace = this.placeService.places;
  //   this.preLoadedPlace = this.loadedPlace.slice(1);
  // }

  //alternative method for toggle sidenav
  // toggleSideNav() {
  //   this.menuCtrl.toggle();
  // }

  onSelectedChange(event: CustomEventInit<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe((userId) => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.loadedPlaces;
        this.preLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(
          (place) => place.userId !== userId
        );
        this.preLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

  doRefresh(event) {
    this.ngOnInit();
    event.target.complete();

    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
  }
}
