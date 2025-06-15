import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPipe } from '../filter.pipe';
import { HttpClient } from '@angular/common/http';
import { OrderByPipe } from "../order-by.pipe";

@Component({
  selector: 'app-list-of-deliveries',
  imports: [FormsModule, CommonModule],
  templateUrl: './list-of-deliveries.component.html',
  styleUrl: './list-of-deliveries.component.scss'
})
export class ListOfDeliveriesComponent {
  DELIVERIES: any[] = [];
  filteredData: any[] = [];
  searchText: string = '';
  key: string = '';
  reverse: boolean = false;
  customerId: string = '';
  currentPage = 1;
  itemsPerPage = 7;
  activeFilter: string = 'all';

  // Summary data
  totalDeliveries = 0;
  deliveredCount = 0;
  inTransitCount = 0;

  headers = [
    "Delivery", "Delivery Item", "Material Number", "Material Name", "Delivery Type", "Sales Unit", "Net Value", "Currency",
    "Delivery Date", "Processing Status", "Plant", "Storage Location", "Shipping Point", "Action"
  ];

  names = [
    "VBELN", "POSNR", "MATNR", "ARKTX", "LFART",
    "VRKME", "NETWR", "WAERK", "LFDAT", "GBSTK", "WERKS", "LGORT", "VSTEL", "action"
  ];

  statusMap: Record<string, any> = {
    'A': { class: 'status-pending', text: 'Pending' },
    'B': { class: 'status-transit', text: 'In Transit' },
    'C': { class: 'status-completed', text: 'Delivered' },
    '': { class: 'status-unknown', text: 'Unknown' }
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';

    if (!this.customerId) {
      console.error('No customerId found in local storage');
      return;
    }

    this.fetchDeliveryData();
  }

  private fetchDeliveryData(): void {
    this.http.post<any>('http://localhost:3000/deliveries', { customerId: this.customerId })
      .subscribe({
        next: (data) => {
          this.DELIVERIES = data.deliveries || [];
          this.filteredData = [...this.DELIVERIES];
          this.updateSummary();
        },
        error: (error) => console.error('Error fetching delivery data', error)
      });
  }

  private updateSummary(): void {
    this.totalDeliveries = this.DELIVERIES.length;
    this.deliveredCount = this.DELIVERIES.filter(item => item.GBSTK === 'C').length;
    this.inTransitCount = this.DELIVERIES.filter(item => ['A', 'B'].includes(item.GBSTK)).length;
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
    
    this.filteredData = this.DELIVERIES.filter((row: any) => {
      const matchesSearch = searchText === '' || 
        Object.values(row).some((val: any) => 
          val?.toString().toLowerCase().includes(searchText)
        );
      
      const matchesFilter = this.activeFilter === 'all' || 
        (this.activeFilter === 'delivered' && row.GBSTK === 'C') ||
        (this.activeFilter === 'transit' && ['A', 'B'].includes(row.GBSTK));
      
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
    
    if (['LFDAT'].includes(column) && typeof value === 'string') {
      return this.formatDate(value);
    }
    
    if (['NETWR'].includes(column) && !isNaN(Number(value))) {
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

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  getTotalValue(): number {
    return this.DELIVERIES.reduce((sum, delivery) => sum + (parseFloat(delivery.NETWR) || 0), 0);
  }

  exportData(): void {
    const headers = this.headers.filter(h => h !== 'Action');
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    this.DELIVERIES.forEach((row: any) => {
      const values = this.names.filter(field => field !== 'action').map(field => {
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
    link.setAttribute('download', `deliveries_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  viewDetails(row: any): void {
    localStorage.removeItem('deliveryData');
    localStorage.setItem('deliveryData', JSON.stringify(row));
    this.router.navigate(['/delivery-detail']);
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
  }
}