import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  IonItemSliding,
  LoadingController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBooking: Booking[];
  bookingSubs: Subscription;
  loading: boolean;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.bookingSubs = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBooking = bookings;
    });
  }

  ionViewWillEnter() {
    this.loading = true;
    this.bookingService.fetchBooking().subscribe(() => {
      this.loading = false;
    });
  }
  ngOnDestroy(): void {
    if (this.bookingSubs) {
      this.bookingSubs.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingEL: IonItemSliding) {
    slidingEL.close();

    this.alertCtrl
      .create({
        header: 'Are you sure?',
        message: 'Do you really want to cancel your booking.',
        buttons: [
          {
            text: 'Go back',
            role: 'cancel',
          },
          {
            text: 'Cancel booking',
            handler: () => {
              this.alertCtrl.dismiss();
            },
            role: 'cancel-booking',
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
        return alertEl.onDidDismiss();
      })
      .then((result) => {
        if (result.role === 'cancel-booking') {
          this.loadingCtrl
            .create({
              message: 'Canelling, please wait..',
            })
            .then((loadingEl) => {
              loadingEl.present();
              this.bookingService.cancelBooking(bookingId).subscribe(() => {
                loadingEl.dismiss();
              });
            });
        }
      });
  }
}
