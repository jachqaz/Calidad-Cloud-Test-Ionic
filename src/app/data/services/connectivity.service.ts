import {Injectable, signal} from '@angular/core';
import {Network} from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  private isOnline = signal(true);

  constructor() {
    this.initializeNetworkListener();
  }

  get connected() {
    return this.isOnline.asReadonly();
  }

  async checkConnection(): Promise<boolean> {
    const status = await Network.getStatus();
    this.isOnline.set(status.connected);
    return status.connected;
  }

  private async initializeNetworkListener(): Promise<void> {
    // Get initial network status
    const status = await Network.getStatus();
    this.isOnline.set(status.connected);

    // Listen for network changes
    Network.addListener('networkStatusChange', (status: any) => {
      this.isOnline.set(status.connected);
    });
  }
}
