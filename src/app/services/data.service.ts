import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // Your backend URL

  constructor(private http: HttpClient) {}

  // Get customer profile details
  getCustomerProfile(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profile`, { customerId });
  }

  // Inquiry data
  getInquiryData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inquiry`, { customerId });
  }

  // Sales orders
  getSalesOrderData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sales`, { customerId });
  }

  // Deliveries
  getDeliveryData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deliveries`, { customerId });
  }

  // Invoices
  getInvoiceData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/invoice`, { customerId });
  }

  // Payments & Aging
  getPaymentsData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payage`, { customerId });
  }

  // Credit/Debit Memos
  getMemoData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/debits`, { customerId });
  }
  getcreditData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/credit`, { customerId });
  }

  // Overall Sales (KPI + charts)
  getOverallSalesData(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/overall-sales`, { customerId });
  }
}
