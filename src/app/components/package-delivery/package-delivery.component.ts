import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-package-delivery',
  templateUrl: './package-delivery.component.html',
  styleUrls: ['./package-delivery.component.css']
})
export class PackageDeliveryComponent implements OnInit {
  deliveryId!: string;
  delivery: any;
  package: any;

  constructor(private apiService: ApiService, private socketService: SocketService) { }

  ngOnInit(): void {
  }

  loadDelivery(){
    this.apiService.getDeliveryById(this.deliveryId).subscribe(delivery => {
      this.delivery = delivery;
      this.apiService.getPackageById(delivery.package_id).subscribe(delPackage => {
        this.package = delPackage;
      });
      navigator.geolocation.watchPosition(position => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.socketService.emit('location_changed', { delivery_id: this.deliveryId, location });
      });

      this.socketService.onDeliveryUpdate('delivery_updated').subscribe((update: any) => {
        if (update._id === delivery._id) {
          this.delivery = update;
        }
      });
    });
  }

  changeStatus(status: string){
    this.socketService.emit('status_changed', { delivery_id: this.deliveryId, status });
  }
}
