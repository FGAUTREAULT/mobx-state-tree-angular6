import { Injectable } from '@angular/core';
import { ISettings } from '../store/settings-tree-store';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  update(settings: ISettings[], params?: HttpParams): Promise<ISettings> {
    return this.http.put<ISettings>('localhost:8080/ztrim-sp/api/v1/settings', settings, { params: params }).toPromise();
  }

  getAll(): Promise<ISettings[]> {
    return this.http.get<ISettings[]>('localhost:8080/ztrim-sp/api/v1/settings').toPromise();
  }
}
