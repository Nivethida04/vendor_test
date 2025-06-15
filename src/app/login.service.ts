import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
private apiUrl = 'http://localhost:3000/login'; // Change if different port or deployed

  constructor(private http: HttpClient) {}

  login(customerId: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { customerId, password });
  }
  
}
