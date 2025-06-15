import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { InquiryDataService } from '../inquiry-data.service';

@Component({
  selector: 'app-inquiry-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inquiry-detail.component.html',
  styleUrls: ['./inquiry-detail.component.scss']
})
export class InquiryDetailComponent implements OnInit {
  inquiryData: any = null;
  loading = true;

  constructor(
    private router: Router,
    private location: Location,
    // private inquiryDataService: InquiryDataService
  ) {}

    ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { inquiryData: any };
    const localStoredData = localStorage.getItem('inquiryData');

    if (state?.inquiryData) {
      this.inquiryData = state.inquiryData;
    } else if (localStoredData) {
      this.inquiryData = JSON.parse(localStoredData);
    } else {
      this.router.navigate(['/inquiry']);
    }

    this.loading = false;
  }
  goBack(): void {
    this.location.back();
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'A': 'status-pending',
      'B': 'status-transit',
      'C': 'status-completed',
      '': 'status-unknown'
    };
    return statusMap[status] || statusMap[''];
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'A': 'Pending',
      'B': 'In Transit',
      'C': 'Completed',
      '': 'Unknown'
    };
    return statusMap[status] || statusMap[''];
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  formatCurrency(value: any): string {
    if (!value || isNaN(Number(value))) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(value));
  }

  formatNumber(value: any): string {
    if (!value || isNaN(Number(value))) return 'N/A';
    return new Intl.NumberFormat('en-US').format(Number(value));
  }
}