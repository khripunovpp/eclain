import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  setItem(key: string, value: any) {
    localStorage?.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    try {
      return JSON.parse(localStorage?.getItem(key) as any);
    } catch (e) {
      console.error('Error parsing JSON', e);
      return null;
    }
  }
}
