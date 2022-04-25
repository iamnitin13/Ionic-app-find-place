import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Coordinates,
  PlaceLocation,
} from 'src/app/places/offers/location.model';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { Geolocation } from '@capacitor/geolocation';
import { KEYS } from '../../apikey';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Input() showPreview = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  loading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheet: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheet
      .create({
        header: 'Please Choose',
        buttons: [
          {
            text: 'Auto-Locate ',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionEl) => {
        actionEl.present();
      });
  }
  private locateUser() {
    let errMessage;
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      errMessage = 'Please use the map to pick a location!';
      this.showErrorAlert(errMessage);
      return;
    }
    this.loading = true;
    Geolocation.getCurrentPosition()
      .then((geoPositon) => {
        const coordinates: Coordinates = {
          lat: geoPositon.coords.latitude,
          lng: geoPositon.coords.longitude,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        errMessage = err?.message;
        this.showErrorAlert(errMessage);
      });
  }

  private showErrorAlert(errMssg: string) {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: errMssg,
        buttons: ['Okay'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
  private openMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
        modalEl.present();
      });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.loading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return of(
            this.pickLoactionImage(pickedLocation.lat, pickedLocation.lng, 16)
          );
        })
      )
      .subscribe((staticMapImage) => {
        pickedLocation.staticMapImageUrl = staticMapImage;
        this.selectedLocationImage = staticMapImage;
        this.loading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEYS.GOOGLE_API_KEY}`
      )
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData?.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private pickLoactionImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${KEYS.GOOGLE_API_KEY}`;
  }
}
