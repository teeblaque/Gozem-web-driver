import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageDeliveryComponent } from './components/package-delivery/package-delivery.component';

const routes: Routes = [
  { path: '', component: PackageDeliveryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
