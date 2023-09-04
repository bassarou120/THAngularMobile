import { Injectable } from "@angular/core";
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: "root",
})
export class CapacitorStorageService {
  constructor() {}

  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  async get(key: string): Promise<any> {
    const ret = await Preferences.get({ key: key });
    const result = JSON.parse(ret.value ||'');
    return result;
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({
      key: key,
    });
  }
}
