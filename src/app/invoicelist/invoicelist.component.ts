import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoicelist',
  imports: [FormsModule, CommonModule],
  templateUrl: './invoicelist.component.html',
  styleUrl: './invoicelist.component.scss'
})
export class InvoicelistComponent {
  INVOICE: any[] = [];
  filteredData: any[] = [];
  searchText: string = '';
  key: string = '';
  reverse: boolean = false;
  customerId: string = '';
  downloadCount: number = 0;
  showPreviewModal: boolean = false;
  previewDocument: string = '';
  currentPreviewVbeln: string = '';
  currentPreviewPosnr: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;

  headers = [
    "Document Number", "Billing Date", "Material Number", "Actions"
  ];

  names = [
    "VBELN", "FKDAT", "POSNR", "ACTIONS"
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';

    if (!this.customerId) {
      console.error('No customerId found in local storage');
      return;
    }

    this.http.post<any>('http://localhost:3000/invoicedata', { customerId: this.customerId }).subscribe(
      (data: any) => {
        this.INVOICE = data.invoice_data;
        this.filteredData = [...this.INVOICE];
      },
      error => {
        console.error('Error fetching delivery data', error);
      }
    );
  }

  getThisMonthCount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.INVOICE.filter(item => {
      const itemDate = new Date(item.FKDAT);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
  }

  sort(key: string): void {
    this.currentPage = 1;
    if (this.key === key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = false;
    }
    this.sortData();
  }

  private sortData(): void {
    if (!this.key) return;
    this.filteredData.sort((a: any, b: any) => {
      const aValue = a[this.key];
      const bValue = b[this.key];

      if (aValue === bValue) return 0;
      return this.reverse
        ? (aValue > bValue ? -1 : 1)
        : (aValue < bValue ? -1 : 1);
    });
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData
      .filter(row => JSON.stringify(row).toLowerCase().includes(this.searchText?.toLowerCase() || ''))
      .slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(
      this.filteredData.filter(row => JSON.stringify(row).toLowerCase().includes(this.searchText?.toLowerCase() || '')).length / this.itemsPerPage
    );
  }

  getFirstItemIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
  }

  getVisiblePages(): any[] {
    const pages: any[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1, 2, 3);
    if (current > 4 && current < total - 2) {
      pages.push('...', current - 1, current, current + 1, '...');
    } else if (current <= 4) {
      pages.push(4, 5, '...');
    } else {
      pages.push('...', total - 2, total - 1);
    }
    pages.push(total - 2, total - 1, total);

    return [...new Set(pages)];
  }

  goToPage(page: number): void {
    this.currentPage = page;
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

  getAriaSort(key: string): string {
    if (this.key !== key) return 'none';
    return this.reverse ? 'descending' : 'ascending';
  }

  previewPDF(vbeln: string, posnr: string): void {
    const payload = { invoiceNumber: vbeln, itemnumber: posnr };

this.http.post('http://localhost:3000/invoice', payload, { responseType: 'blob' }).subscribe(
  (blob: Blob) => {
    const fileURL = URL.createObjectURL(blob);
    this.previewDocument = fileURL;
    this.currentPreviewVbeln = vbeln;
    this.currentPreviewPosnr = posnr;
    this.showPreviewModal = true;
    document.body.style.overflow = 'hidden';
  },
  error => {
    console.error('Error fetching PDF preview', error);
    alert('Failed to fetch invoice preview.');
  }
  );
  this.previewDocument = '';
  URL.revokeObjectURL(this.previewDocument);

    this.currentPreviewVbeln = vbeln;
    this.currentPreviewPosnr = posnr;
    this.showPreviewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    document.body.style.overflow = 'auto';
  }

  downloadCurrentPreview(): void {
    this.downloadPDF(this.currentPreviewVbeln, this.currentPreviewPosnr);
    this.closePreviewModal();
  }

  downloadPDF(vbeln: string, posnr: string): void {
    const payload = {
      invoiceNumber: vbeln,
      itemnumber: posnr
    };

    this.http.post('http://localhost:3000/invoice', payload, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${vbeln}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadCount++;
      },
      error => {
        console.error('Error downloading PDF', error);
        alert('Failed to download invoice PDF.');
      }
    );
  }

  viewDetails(row: any): void {
    console.log('Invoice Details:', row);
  }
}
