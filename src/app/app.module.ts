import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PackageDeliveryComponent } from './components/package-delivery/package-delivery.component';
import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    PackageDeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ApiService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
