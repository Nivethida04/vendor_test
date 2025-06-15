import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payage',
  imports: [FormsModule, CommonModule],
  templateUrl: './payage.component.html',
  styleUrl: './payage.component.scss'
})
export class PayageComponent {
  PAYAGE: any[] = [];
  searchText: string = '';
  key: string = '';
  reverse: boolean = false;
  customerId = '';

  headers = [
    "Billing Number", "Billing Date", "Due Date", "Aging", "Payment Status", "Division",
    "Net Value", "Currency", "Payment Terms", "Organization", "Channel"
  ];

  names = [
    "VBELN", "FKDAT", "DUE_DATE", "AGING", "PAYMENT_STATUS", "SPART",
    "NETWR", "WAERK", "ZTERM", "VKORG", "VTWEG"
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';

    if (!this.customerId) {
      console.error('No customerId found in local storage');
      return;
    }

    this.http.post<any>('http://localhost:3000/payage', { customerId: this.customerId }).subscribe(
      (data: any) => {
        this.PAYAGE = data.payage || [];
      },
      error => {
        console.error('Error fetching payment data', error);
      }
    );
  }

  getThisMonthCount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.PAYAGE.filter(item => {
      const itemDate = new Date(item.FKDAT);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
  }

  getAgingCount(): number {
    return this.PAYAGE.filter(item => {
      const aging = parseInt(item.AGING) || 0;
      return aging > 30; // Items older than 30 days
    }).length;
  }

  getTotalValue(): number {
    return this.PAYAGE.reduce((sum, item) => sum + (parseFloat(item.NETWR) || 0), 0);
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'PAID': 'status-paid',
      'PENDING': 'status-pending',
      'OVERDUE': 'status-overdue'
    };
    return statusMap[status?.toUpperCase()] || 'status-pending';
  }

  sort(key: string): void {
    this.currentPage = 1;
    if (this.key === key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = false;
    }
  }

  currentPage = 1;
  itemsPerPage = 7;

  get paginatedData() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;

  const sorted = [...this.filteredData].sort((a, b) => {
    if (!this.key) return 0;
    return this.reverse
      ? (a[this.key] > b[this.key] ? -1 : 1)
      : (a[this.key] < b[this.key] ? -1 : 1);
  });

  return sorted.slice(start, end);
}

  get totalPages() {
    return Math.ceil(
      this.PAYAGE.filter(row => JSON.stringify(row).toLowerCase().includes(this.searchText?.toLowerCase() || '')).length / this.itemsPerPage
    );
  }
  get filteredData() {
  return this.PAYAGE.filter(row =>
    JSON.stringify(row).toLowerCase().includes(this.searchText?.toLowerCase() || '')
  );
}

getFirstItemIndex(): number {
  return this.filteredData.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
}

getLastItemIndex(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
}

goToFirstPage(): void {
  this.currentPage = 1;
}

goToLastPage(): void {
  this.currentPage = this.totalPages;
}

goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

goToNextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

goToPage(page: number | string): void {
  if (typeof page === 'number') {
    this.currentPage = page;
  }
}

getVisiblePages(): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (this.totalPages <= maxVisible) {
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
  } else {
    if (this.currentPage <= 3) {
      pages.push(1, 2, 3, '...', this.totalPages);
    } else if (this.currentPage >= this.totalPages - 2) {
      pages.push(1, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(1, '...', this.currentPage, '...', this.totalPages);
    }
  }
  

  return pages;
}

}