import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

declare var google: any;
@Component({
  selector: 'app-package-delivery',
  templateUrl: './package-delivery.component.html',
  styleUrls: ['./package-delivery.component.css']
})
export class PackageDeliveryComponent implements OnInit, OnDestroy {
  deliveryId: string = '';
  delivery: any = null;
  package: any = null;
  map: any;
  markers: any = {};
  locationInterval: any;
  selectedDelivery: any = null;

  @ViewChild('map', { static: true })
  mapElement!: ElementRef;

  constructor(private apiService: ApiService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.onEvent('delivery_updated').subscribe((updatedDelivery) => {
      if (this.delivery && this.delivery.delivery_id === updatedDelivery.delivery_id) {
        this.delivery = updatedDelivery;
        this.loadPackageDetails(updatedDelivery.package_id);
        this.updateMarker('current', updatedDelivery.location);
      }
    });
    this.initializeMap();

    setInterval(()=> { 
      if (this.delivery) {
        this.selectDelivery();
      }
    }, 20000);
  }

  ngOnDestroy(): void {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
  }

  selectDelivery() {
    this.updateLocation();
  }

  updateMarker(type: string, position: { lat: number, lng: number }) {
    if (!this.markers[type]) {
      this.markers[type] = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(position.lat, position.lng),
        label: type.charAt(0).toUpperCase(),
      });
    } else {
      this.markers[type].setPosition(new google.maps.LatLng(position.lat, position.lng));
    }
  }

  initializeMap() {
    const mapProperties = {
      center: new google.maps.LatLng(0, 0),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
  }

  loadDelivery() {
    this.apiService.getDeliveryById(this.deliveryId).subscribe((delivery) => {
      this.delivery = delivery[0];
      this.loadPackageDetails(this.delivery.package_id);
      this.updateMarker('current', this.delivery.location);
    });
  }

  loadPackageDetails(packageId: string) {
    this.apiService.getPackageById(packageId).subscribe((packages) => {
      this.package = packages;
    });
  }

  updateStatus(status: string) {
    if (this.delivery) {
      this.socketService.emitEvent('status_changed', { delivery_id: this.delivery.delivery_id, status });
    }
  }

  updateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.updateMarker('current', location);
        console.log(location);
        this.socketService.emitEvent('location_changed', { delivery_id: this.delivery.delivery_id, location });
      });
    }
  }
}
