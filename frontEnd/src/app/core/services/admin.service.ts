import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Destination, DestinationRequest, BulkAddResult } from '../models/destination.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  fetchFromApi(page = 0, size = 10): Observable<Page<Destination>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Destination>>(
      `${this.baseUrl}/api/admin/fetch-from-api`,
      { params }
    );
  }

  addDestination(payload: DestinationRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/api/admin/destinations`, payload, {
      responseType: 'text',
    });
  }

  bulkAddDestinations(payload: DestinationRequest[]): Observable<BulkAddResult> {
    return this.http.post<BulkAddResult>(
      `${this.baseUrl}/api/admin/destinations/bulk`,
      payload
    );
  }

  deleteDestination(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/api/admin/destinations/${id}`
    );
  }

  getAllDestinations(page = 0, size = 10): Observable<Page<Destination>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Destination>>(
      `${this.baseUrl}/api/user/approved-destinations`,
      { params }
    );
  }
}
