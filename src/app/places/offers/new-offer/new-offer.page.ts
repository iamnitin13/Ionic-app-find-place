import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { PlaceLocation } from '../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  // converting long string imageurl into file
  // private base64toBlob(base64Data, contentType) {
  //   contentType = contentType || '';
  //   const sliceSize = 1024;
  //   const byteCharacters = atob(base64Data);
  //   const bytesLength = byteCharacters.length;
  //   const slicesCount = Math.ceil(bytesLength / sliceSize);
  //   const byteArrays = new Array(slicesCount);

  //   for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
  //     const begin = sliceIndex * sliceSize;
  //     const end = Math.min(begin + sliceSize, bytesLength);

  //     const bytes = new Array(end - begin);
  //     for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
  //       bytes[i] = byteCharacters[offset].charCodeAt(0);
  //     }
  //     byteArrays[sliceIndex] = new Uint8Array(bytes);
  //   }
  //   return new Blob(byteArrays, { type: contentType });
  // }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
      location: new FormControl(null),
      image: new FormControl(null, Validators.required),
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  onImagePicked(imageData: string | File) {
    // let imageFile;
    // if (typeof imageData === 'string') {
    //   try {
    //     imageFile = this.base64toBlob(
    //       imageData.replace('data:image/jpeg;base64,', ''),
    //       'image/jpeg'
    //     );
    //   } catch (error) {
    //     console.log('Error on converting image to file type', error);
    //     return;
    //   }
    // } else {
    //   imageFile = imageData;
    // }
    this.form.patchValue({ image: imageData });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    const { title, description, price, fromDate, toDate, location, image } =
      this.form.value;

    this.loadingCtrl
      .create({
        message: 'Creating new place...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .addPlace(
            title,
            description,
            +price,
            new Date(fromDate),
            new Date(toDate),
            location,
            image
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
