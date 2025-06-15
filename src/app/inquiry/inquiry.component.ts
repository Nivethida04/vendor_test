import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FilterPipe } from '../filter.pipe';
import { HttpClient } from '@angular/common/http';
import { OrderByPipe } from '../order-by.pipe';

interface FilterOption {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-inquiry',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.scss'
})
export class InquiryComponent {
  INQUIRY: any[] = [];
  filteredData: any[] = [];
  searchText: string = '';
  key: string = '';
  reverse: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 7;
  customerId: string = '';
  activeFilter: string = 'all';

  headers = [
    "Sales Document", "Creation Date", "Created By", "Organization", "Distribution Channel",
    "Division", "Processing Status", "Sales Item", "Item name",
    "Material Number", "Order Quantity", "Sales Unit",
    "Valid From", "Valid Until", "Action"
  ];

  names = [
    "VBELN", "ERDAT", "ERNAM", "VKORG", "VTWEG",
    "SPART", "GBSTK", "POSNR", "ARKTX",
    "MATNR", "KWMENG", "VRKME", 
    "ANGDT", "BNDDT", "action"
  ];

  filters = [
    { value: 'all', label: 'All Documents', icon: 'bi bi-calendar' },
    { value: 'completed', label: 'Completed', icon: 'bi bi-check-circle' },
    { value: 'inProgress', label: 'In Progress', icon: 'bi bi-clock' }
  ];

  statusMap: Record<string, any> = {
    'A': { class: 'status-pending', text: 'Pending' },
    'B': { class: 'status-transit', text: 'In Transit' },
    'C': { class: 'status-completed', text: 'Completed' },
    '': { class: 'status-unknown', text: 'Unknown' }
  };

  constructor(private http: HttpClient, private router: Router) {}

  totalDocuments: number = 0;
  completedCount: number = 0;
  pendingCount: number = 0;

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    if (!this.customerId) {
      console.error('No customerId found in local storage');
      return;
    }

    this.fetchInquiryData();
  }

  private updateCounts(): void {
    this.totalDocuments = this.INQUIRY.length;
    this.completedCount = this.INQUIRY.filter(item => item.GBSTK === 'C').length;
    this.pendingCount = this.INQUIRY.filter(item => ['A', 'B'].includes(item.GBSTK)).length;
  }

  private fetchInquiryData(): void {
    this.http.post<any>('http://localhost:3000/inquiry', { customerId: this.customerId })
      .subscribe({
        next: (data) => {
          this.INQUIRY = data.inquiries || [];
          this.filteredData = [...this.INQUIRY];
          this.updateCounts();
        },
        error: (error) => console.error('Error fetching inquiry data', error)
      });
  }

  getThisMonthCount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.INQUIRY.filter(item => {
      const itemDate = new Date(item.ERDAT);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.filterData();
  }

  search(): void {
    this.currentPage = 1;
    this.filterData();
  }

  private filterData(): void {
    const searchText = this.searchText?.toLowerCase() || '';
    
    this.filteredData = this.INQUIRY.filter((row: any) => {
      const matchesSearch = searchText === '' || 
        Object.values(row).some((val: any) => 
          val?.toString().toLowerCase().includes(searchText)
        );
      
      const matchesFilter = this.activeFilter === 'all' || 
        (this.activeFilter === 'completed' && row.GBSTK === 'C') ||
        (this.activeFilter === 'pending' && ['A', 'B'].includes(row.GBSTK));
      
      return matchesSearch && matchesFilter;
    });
  }

  setActiveFilter(filterValue: string): void {
    this.activeFilter = filterValue;
    this.currentPage = 1;
    this.filterData();
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
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  getStatusClass(status: string): string {
    return this.statusMap[status]?.class || this.statusMap[''].class;
  }

  getStatusText(status: string): string {
    return this.statusMap[status]?.text || this.statusMap[''].text;
  }

  formatCellValue(value: any, column: string): string {
    if (value === null || value === undefined) return '';
    
    if (['ERDAT', 'ANGDT', 'BNDDT'].includes(column) && typeof value === 'string') {
      return this.formatDate(value);
    }
    
    if (column === 'KWMENG' && !isNaN(Number(value))) {
      return Number(value).toLocaleString();
    }
    
    return value.toString();
  }

  private formatDate(dateString: string): string {
    return dateString;
  }

  getAriaSort(key: string): string {
    if (this.key !== key) return 'none';
    return this.reverse ? 'descending' : 'ascending';
  }

  trackByFn(index: number, item: any): string {
    return item.VBELN + item.POSNR;
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

  exportData(): void {
    const headers = this.headers;
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    this.INQUIRY.forEach((row: any) => {
      const values = this.names.map(field => {
        const value = row[field] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiry_data_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private showOrderDetails(order: any): void {
    const groupedDetails = {
      headerInfo: {
        document: order.VBELN,
        createdOn: order.ERDAT,
        createdBy: order.ERNAM,
        status: this.getStatusText(order.GBSTK)
      },
      organizationInfo: {
        org: order.VKORG,
        channel: order.VTWEG,
        division: order.SPART
      },
      itemDetails: {
        name: order.ARKTX,
        material: order.MATNR,
        quantity: order.KWMENG,
        unit: order.VRKME
      },
      validity: {
        from: order.ANGDT,
        to: order.BNDDT
      }
    };
    
    console.log('Grouped Order Details:', groupedDetails);
  }
  viewDetails(row: any): void {
  localStorage.setItem('inquiryData', JSON.stringify(row));
  this.router.navigate(['/inquiry-detail']);
}

}