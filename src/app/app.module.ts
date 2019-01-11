import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreManagerComponent } from './store-manager/store-manager.component';
import { ActionSidePanelComponent } from './action-side-panel/action-side-panel.component';
import { JsonDisplayComponent } from './json-display/json-display.component';
import { SharedModule } from 'src/shared/shared.module';
import { fakeBackendProvider } from './rest/interceptor/fake-backend.interceptor.mock';

@NgModule({
  declarations: [
    AppComponent,
    StoreManagerComponent,
    ActionSidePanelComponent,
    JsonDisplayComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
