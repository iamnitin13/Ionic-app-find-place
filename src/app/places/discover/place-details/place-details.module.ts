import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailsPageRoutingModule } from './place-details-routing.module';

import { PlaceDetailsPage } from './place-details.page';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailsPageRoutingModule,
    SharedModule,
  ],
  declarations: [PlaceDetailsPage, CreateBookingsComponent],
})
export class PlaceDetailsPageModule {}
