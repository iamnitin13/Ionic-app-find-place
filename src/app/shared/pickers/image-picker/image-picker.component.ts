import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Input() showPreview = false;
  @Output() imagePick = new EventEmitter<string | File>();
  selectedImage: string;
  usePicker: boolean = false;

  constructor(private alertCtrl: AlertController, private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile', this.platform.is('mobile'));
    console.log('Hybrid', this.platform.is('hybrid'));
    console.log('android', this.platform.is('android'));
    console.log('Desktop', this.platform.is('desktop'));

    if (!this.platform.is('hybrid')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    let errMessage;
    if (!Capacitor.isPluginAvailable('Camera')) {
      // errMessage = 'Please use the map to pick a location!';
      // this.showErrorAlert(errMessage);
      this.filePickerRef.nativeElement.click();
      return;
    }
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.DataUrl,
    })
      .then((image) => {
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      })
      .catch((err) => {
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
          return;
        }
        errMessage = err?.message;
        this.showErrorAlert(errMessage);
      });
  }

  private showErrorAlert(errMssg: string) {
    this.alertCtrl
      .create({
        header: 'Could not fetch Image',
        message: errMssg,
        buttons: ['Okay'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
