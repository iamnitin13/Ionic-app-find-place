import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit, OnDestroy {
  place: Place;
  isBookable: boolean;
  loading: boolean;

  private placesSub: Subscription;

  constructor(
    // private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramsMap) => {
      if (!paramsMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.loading = true;
      let fetchUserId: string;
      this.authService.userId
        .pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              throw new Error('No userId found!');
            }
            fetchUserId = userId;
            return this.placeService.getPlace(paramsMap.get('placeId'));
          })
        )
        .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = this.place.userId !== fetchUserId;
            this.loading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigateByUrl('/places/tabs/discover');
                    },
                  },
                ],
              })
              .then((alertEl) => alertEl.present());
          }
        );
    });
  }

  onShowFullMap() {
    this.modalController
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.lng,
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address,
        },
      })
      .then((modelEl) => {
        modelEl.present();
      });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onBookingPlace(): void {
    // this.router.navigateByUrl('/pages/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select',
            handler: () => {
              this.openModelController('select');
            },
          },
          {
            text: 'Random',
            handler: () => {
              this.openModelController('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => actionSheetEl.present());
  }

  openModelController(mode: 'select' | 'random') {
    this.modalController
      .create({
        component: CreateBookingsComponent,
        componentProps: { bookPlace: this.place, selectionMode: mode },
      })
      .then((modelEL) => {
        modelEL.present();
        return modelEL.onDidDismiss();
      })
      .then((result) => {
        if (result.role === 'confirm') {
          this.loadingCtrl
            .create({
              message: 'Creating new booking, pleae wait..',
            })
            .then((loadingEL) => {
              loadingEL.present();
              const { firstName, lastName, guestsNumber, startDate, endDate } =
                result.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  firstName,
                  lastName,
                  guestsNumber,
                  startDate,
                  endDate
                )
                .subscribe(() => {
                  loadingEL.dismiss();
                });
            });
        }
      });
  }
}
