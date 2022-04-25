import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.model';

@Component({
  selector: 'app-create-bookings',
  templateUrl: './create-bookings.component.html',
  styleUrls: ['./create-bookings.component.scss'],
})
export class CreateBookingsComponent implements OnInit {
  @Input() bookPlace: Place;
  @Input() selectionMode: 'select' | 'random';

  @ViewChild('f', { static: true }) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.bookPlace.availableFrom);
    const availableTo = new Date(this.bookPlace.availableTo);
    if (this.selectionMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableTo.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  dateValid() {
    const startDate = this.form.value['fromDate'];
    const endDate = this.form.value['toDate'];
    return endDate > startDate;
  }

  onCreateBoooking() {
    if (!this.form.valid || !this.dateValid()) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['fName'],
          lastName: this.form.value['lName'],
          guestsNumber: +this.form.value['guestsNumber'],
          startDate: new Date(this.form.value['fromDate']),
          endDate: new Date(this.form.value['toDate']),
        },
      },
      'confirm'
    );
  }
}
