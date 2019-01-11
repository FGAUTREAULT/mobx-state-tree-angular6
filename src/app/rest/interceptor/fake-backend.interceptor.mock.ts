import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ISettings } from 'src/app/store/settings-tree-store';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  _settingsMock: ISettings[] = [
    {
      id: 'user-settings0',
      version: 43,
      type: 'settings',
      dashboard: {
        defaultId: null
      },
      lang: null,
      actionableOptimizationSettings: {
        mainframeCapacityInfo: 'Medium: 500 - 2000',
        numberOfCpc: 1,
        msuAnnualCost: null,
        currency: 'USD',
        annualCostPerLicense: 0,
        numberOfLicenses: 1,
        rebate: 0,
        acquisitionDate: '2019-01-09T23:00:00.000Z'
      }
    }
  ];

  _settings: ISettings[] = this._settingsMock;

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // Intercept Authenticate call
      if (request.url.endsWith('/settings') && request.method === 'GET') {
        return of(new HttpResponse({ status: 200, body: this._settings }));
      } else if (request.url.endsWith('/settings') && request.method === 'PUT') {
        console.log(request.body);
        this._settings = request.body;
        return of(new HttpResponse({ status: 200 }));
      } else {
        // tslint:disable-next-line:max-line-length
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'Error', status: 404, statusText: 'NotFound' });
        return throwError(error);
      }

      return next.handle(request);
    }))
      // Fake server delay
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
