import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreditComponent } from "../credit/credit.component";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-credit-debit',
  imports: [CommonModule, FormsModule, CreditComponent],
  templateUrl: './credit-debit.component.html',
  styleUrl: './credit-debit.component.scss'
})
export class CreditDebitComponent {
  CREDIT: any[] = [];
  DEBIT: any[] = [];
  searchText: string = '';
  key: string = '';
  reverse: boolean = false;
  activeTable: 'credit' | 'debit' = 'credit';

  headers = [
    'Billing Document Number', 'Billing Type', 'Billing Category', 'Document Category',
    'Sales Organization', 'Sold-To Party', 'Document Currency', 'Pricing Procedure',
    'Document Condition Number', 'Billing Date', 'Exchange Rate', 'Net Value of the Billing Document',
    'Entry Time', 'Entry Date', 'Customer Purchase Order Number', 'Material Number',
    'Item Number of Billing Document', 'Sales Unit (Unit of Measure)'
  ];

  names = [
    'VBELN', 'FKART', 'FKTYP', 'VBTYP', 'VKORG', 'KUNAG', 'WAERK',
    'KALSM', 'KNUMV', 'FKDAT', 'KURRF', 'NETWR', 'ERZET',
    'ERDAT', 'BSTNK_VF', 'MATNR', 'POSNR', 'VRKME'
  ];
  customerId = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';

    if (!this.customerId) {
      console.error('No customerId found in local storage');
      return;
    }

    this.fetchCreditData();
    this.fetchDebitData();
  }

  fetchCreditData(): void {
    this.http.post<any>('http://localhost:3000/credit', { customerId: this.customerId }).subscribe(
      (data: any) => {
        this.CREDIT = data.credits;
      },
      error => {
        console.error('Error fetching credit memo data', error);
      }
    );
  }

  fetchDebitData(): void {
    this.http.post<any>('http://localhost:3000/debits', { customerId: this.customerId }).subscribe(
      (data: any) => {
        this.DEBIT = data.debits;
      },
      error => {
        console.error('Error fetching debit memo data', error);
      }
    );
  }

  getCreditCount(): number {
    return this.CREDIT.length;
  }

  getDebitCount(): number {
    return this.DEBIT.length;
  }

  getNetAmount(): number {
    const creditTotal = this.CREDIT.reduce((sum, item) => sum + (parseFloat(item.NETWR) || 0), 0);
    const debitTotal = this.DEBIT.reduce((sum, item) => sum + (parseFloat(item.NETWR) || 0), 0);
    return creditTotal - debitTotal;
  }

  getThisMonthCount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const creditThisMonth = this.CREDIT.filter(item => {
      const itemDate = new Date(item.FKDAT);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
    const debitThisMonth = this.DEBIT.filter(item => {
      const itemDate = new Date(item.FKDAT);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
    return creditThisMonth + debitThisMonth;
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

  showTable(table: 'credit' | 'debit') {
    this.activeTable = table;
    this.currentPage = 1;
    this.searchText = '';
  }

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

get filteredData() {
  const data = this.activeTable === 'credit' ? this.CREDIT : this.DEBIT;
  return data.filter(row =>
    JSON.stringify(row).toLowerCase().includes(this.searchText?.toLowerCase() || '')
  );
}

get totalPages() {
  return Math.ceil(this.filteredData.length / this.itemsPerPage);
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
  if (this.currentPage > 1) this.currentPage--;
}

goToNextPage(): void {
  if (this.currentPage < this.totalPages) this.currentPage++;
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
exportToPDF(): void {
  const doc = new jsPDF('landscape');
  autoTable(doc, {
    head: [this.headers],
    body: this.paginatedData.map(row => this.names.map(col => row[col]))
  });
  doc.save('credit-memos.pdf');
}
}
