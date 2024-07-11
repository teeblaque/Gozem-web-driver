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
  selectedDelivery: any = {};
  locationInterval: any;

  currentLocationMarker: any;
  sourceMarker: any;
  destinationMarker: any;

  @ViewChild('map', { static: true })
  mapElement!: ElementRef;

  constructor(private apiService: ApiService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.onEvent('delivery_updated').subscribe((updatedDelivery) => {
      if (this.delivery && this.delivery.delivery_id === updatedDelivery.delivery_id) {
        this.delivery = updatedDelivery;
        this.loadPackageDetails(updatedDelivery.package_id);
        this.updateMarkers();
      }
    });
    this.initializeMap();
    this.locationInterval = setInterval(()=> { 
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

  updateMarkers() {
    if (this.delivery) {
      const source = this.selectedDelivery.package.from_location || { lat: 0, lng: 0 };
      const destination = this.selectedDelivery.package.to_location || { lat: 0, lng: 0 };
      const location = this.delivery.location || { lat: 0, lng: 0 };

      if (!this.sourceMarker) {
        this.sourceMarker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(source.lat, source.lng),
          label: 'S'
        });
      } else {
        this.sourceMarker.setPosition(new google.maps.LatLng(source.lat, source.lng));
      }

      if (!this.destinationMarker) {
        this.destinationMarker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(destination.lat, destination.lng),
          label: 'D'
        });
      } else {
        this.destinationMarker.setPosition(new google.maps.LatLng(destination.lat, destination.lng));
      }

      if (!this.currentLocationMarker) {
        this.currentLocationMarker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(location.lat, location.lng),
          label: 'C'
        });
      } else {
        this.currentLocationMarker.setPosition(new google.maps.LatLng(location.lat, location.lng));
      }
      this.map.setCenter(new google.maps.LatLng(location.lat, location.lng));
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
      this.selectedDelivery = delivery[0];
      this.loadPackageDetails(this.delivery.package_id);
      this.updateMarkers();
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
        this.updateMarkers();
        console.log(location);
        this.socketService.emitEvent('location_changed', { delivery_id: this.delivery.delivery_id, location });
      });
    }
  }
}
