import { HttpInterceptorFn, HttpResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Destination } from '../models/destination.model';
import { AuthResponse } from '../models/auth.model';
import { Page } from '../models/page.model';

let mockDestinations: Destination[] = [
  { id: 1, name: 'France', capital: 'Paris', region: 'Europe', population: 67000000, currency: 'EUR', flagUrl: 'https://flagcdn.com/w320/fr.png', approved: true },
  { id: 2, name: 'Japan', capital: 'Tokyo', region: 'Asia', population: 125000000, currency: 'JPY', flagUrl: 'https://flagcdn.com/w320/jp.png', approved: true },
  { id: 3, name: 'Brazil', capital: 'Brasilia', region: 'Americas', population: 214300000, currency: 'BRL', flagUrl: 'https://flagcdn.com/w320/br.png', approved: true },
  { id: 4, name: 'Australia', capital: 'Canberra', region: 'Oceania', population: 25680000, currency: 'AUD', flagUrl: 'https://flagcdn.com/w320/au.png', approved: true },
  { id: 5, name: 'Canada', capital: 'Ottawa', region: 'Americas', population: 38000000, currency: 'CAD', flagUrl: 'https://flagcdn.com/w320/ca.png', approved: false },
  { id: 6, name: 'Egypt', capital: 'Cairo', region: 'Africa', population: 104000000, currency: 'EGP', flagUrl: 'https://flagcdn.com/w320/eg.png', approved: true },
  { id: 7, name: 'Germany', capital: 'Berlin', region: 'Europe', population: 83000000, currency: 'EUR', flagUrl: 'https://flagcdn.com/w320/de.png', approved: true }
];

export const mockInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  console.log(`[Mock API] ${req.method} ${req.url}`);

  let path = req.url;
  try {
    const url = new URL(req.url, 'http://localhost');
    path = url.pathname;
  } catch (e) {
    // ignore
  }
  
  // POST /api/auth/login or register
  if (path.includes('/api/auth/')) {
    const isLogin = path.includes('/login');
    const body = req.body as any;
    const role = body?.username?.toLowerCase() === 'admin' ? 'ADMIN' : 'USER';
    const authRes: AuthResponse = {
      username: body?.username || 'mockuser',
      role,
      token: 'mock-jwt-token-12345'
    };
    return of(new HttpResponse({ status: isLogin ? 200 : 201, body: authRes })).pipe(delay(500));
  }
  
  // Admin Endpoints
  if (path.includes('/api/admin/fetch-from-api')) {
    const pageStr = req.params.get('page') || '0';
    const sizeStr = req.params.get('size') || '10';
    const page = parseInt(pageStr, 10);
    const size = parseInt(sizeStr, 10);
    
    // Unapproved or external destinations
    const list = mockDestinations.filter(d => !d.approved);
    
    const pageRes: Page<Destination> = {
      content: list.slice(page * size, (page + 1) * size),
      pageable: { pageNumber: page, pageSize: size },
      totalElements: list.length,
      totalPages: Math.ceil(list.length / size) || 1
    };
    return of(new HttpResponse({ status: 200, body: pageRes })).pipe(delay(500));
  }
  
  if (path.includes('/api/admin/destinations/bulk') && req.method === 'POST') {
    const body = req.body as any[];
    body.forEach(b => {
      mockDestinations.push({
        ...b,
        id: Math.max(...mockDestinations.map(d => d.id), 0) + 1,
        approved: true
      } as Destination);
    });
    return of(new HttpResponse({ status: 201, body: { saved: body.length, skipped: 0, skippedNames: [] } })).pipe(delay(500));
  }

  if (path.includes('/api/admin/destinations') && req.method === 'POST') {
    const body = req.body as Partial<Destination>;
    mockDestinations.push({
      ...body,
      id: Math.max(...mockDestinations.map(d => d.id), 0) + 1,
      approved: true
    } as Destination);
    return of(new HttpResponse({ status: 201, body: 'Destination created successfully' })).pipe(delay(500));
  }
  
  if (path.match(/\/api\/admin\/destinations\/\d+/) && req.method === 'DELETE') {
    const id = parseInt(path.split('/').pop() || '0', 10);
    mockDestinations = mockDestinations.filter(d => d.id !== id);
    return of(new HttpResponse({ status: 200, body: { message: 'Destination Deleted successfully' } })).pipe(delay(500));
  }
  
  // User Endpoints
  if (path.includes('/api/user/approved-destinations')) {
    const pageStr = req.params.get('page') || '0';
    const sizeStr = req.params.get('size') || '10';
    const page = parseInt(pageStr, 10);
    const size = parseInt(sizeStr, 10);
    
    const list = mockDestinations.filter(d => d.approved);
    
    const pageRes: Page<Destination> = {
      content: list.slice(page * size, (page + 1) * size),
      pageable: { pageNumber: page, pageSize: size },
      totalElements: list.length,
      totalPages: Math.ceil(list.length / size) || 1
    };
    return of(new HttpResponse({ status: 200, body: pageRes })).pipe(delay(500));
  }
  
  if (path.includes('/api/user/destinations/search') && req.method === 'GET') {
    const name = req.params.get('name')?.toLowerCase() || '';
    const list = mockDestinations.filter(d => d.approved && d.name.toLowerCase().includes(name));
    return of(new HttpResponse({ status: 200, body: list })).pipe(delay(500));
  }

  if (path.match(/\/api\/user\/destination\/\d+\/want-to-visit/) && req.method === 'POST') {
    return of(new HttpResponse({ status: 200, body: { message: 'Destination marked as Want to Visit' } })).pipe(delay(500));
  }
  
  if (path.match(/\/api\/user\/destination\/\d+/) && req.method === 'GET') {
    const id = parseInt(path.split('/').pop() || '0', 10);
    const dest = mockDestinations.find(d => d.id === id);
    if (dest) {
      return of(new HttpResponse({ status: 200, body: dest })).pipe(delay(500));
    } else {
       return of(new HttpResponse({ status: 404, body: { error: 'Not found' } })).pipe(delay(500));
    }
  }
  
  // Fallback
  return next(req);
};
