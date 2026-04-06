import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Destination } from '../models/destination.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getApprovedDestinations(page = 0, size = 10): Observable<Page<Destination>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Destination>>(
      `${this.baseUrl}/api/user/approved-destinations`,
      { params }
    );
  }

  getDestinationById(id: number): Observable<Destination> {
    return this.http.get<Destination>(
      `${this.baseUrl}/api/user/destination/${id}`
    );
  }

  searchDestinations(name: string): Observable<Destination[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Destination[]>(
      `${this.baseUrl}/api/user/destinations/search`,
      { params }
    );
  }

  markWantToVisit(destinationId: number, userId: number): Observable<{ message: string }> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/api/user/destination/${destinationId}/want-to-visit`,
      null,
      { params }
    );
  }
}
