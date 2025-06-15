import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class ProfileComponent implements OnInit{
  name1 = '';
  customerId = '';
  city = '';
  postal_code = '';
  address_number = '';
  street_house = '';
  Valid_from = '';
  Valid_to = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';

    if (!this.customerId) {
      console.error('No customerId found in local storage');
      return;
    }

    this.http.post<any>('http://localhost:3000/profile', { customerId: this.customerId }).subscribe(
      data => {
        this.name1 = data.name;
        this.city = data.city;
        this.postal_code = data.postalCode;
        this.street_house = data.shortName;
        this.address_number = data.addressNumber;
        this.Valid_from = data.dateFrom;
        this.Valid_to = data.dateTo;
      },
      error => {
        console.error('Failed to fetch profile:', error);
      }
    );
  }

  getInitials(): string {
    if (!this.name1) return '?';
    const parts = this.name1.trim().split(' ');
    return parts.length > 1
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  }
}