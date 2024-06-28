import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:9000/api/v1';

  constructor(private http: HttpClient) { }

  getPackageById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/package/${id}`);
  }

  getDeliveryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/delivery/${id}`);
  }
}
