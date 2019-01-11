import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreManagerService {

  count: number;

  constructor() {
  }

  initSettings(settingsLength: number) {
    this.count = settingsLength;
  }

  getSettingId() {
    return this.count - 1;
  }

  getNextSettingId() {
    return this.count;
  }

}
