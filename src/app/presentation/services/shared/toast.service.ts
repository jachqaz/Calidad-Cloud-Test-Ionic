import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  showSuccess(message: string, duration = 2000) {
    this.showToast(message, 'success', duration);
  }

  showError(message: string, duration = 3000) {
    this.showToast(message, 'danger', duration);
  }

  showInfo(message: string, duration = 2000) {
    this.showToast(message, 'primary', duration);
  }

  private showToast(message: string, color: string, duration: number) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = duration;
    toast.color = color;
    document.body.appendChild(toast);
    toast.present();
  }
}
