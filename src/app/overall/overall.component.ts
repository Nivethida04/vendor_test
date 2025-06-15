import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-overall',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './overall.component.html',
  styleUrls: ['./overall.component.scss']
})
export class OverallComponent implements OnInit {
  // Data arrays
  salesData: any[] = [];
  inquiryData: any[] = [];
  deliveryData: any[] = [];
  paymentsData: any[] = [];
  memoData: any[] = [];
  creditData: any[] = [];
  
  // Filtered data
  filteredSalesData: any[] = [];
  filteredInquiryData: any[] = [];
  
  // UI State
  isLoading = true;
  error = '';
  activeSection = 'sales';
  
  // Filter properties
  selectedProduct = 'All';
  selectedDateRange = 'All';
  selectedInquiryMaterial = 'All';

  // KPIs for different sections
  salesKpis = {
    totalOrders: 0,
    totalRevenue: 0,
    avgRevenue: 0,
    avgOrderValue: 0
  };

  inquiryKpis = {
    totalInquiries: 0,
    completed: 0,
    inTransit: 0,
    pending:0
  };

  othersKpis = {
    totalDeliveries: 0,
    processing: 0,
    totalPayments: 0,
    agingItems: 0
  };

  // Chart Data
  revenueByMaterialData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Revenue',
      backgroundColor: '#c41e3a',
      borderColor: '#c41e3a',
      borderWidth: 1
    }]
  };

  quantityByMaterialData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#c41e3a', '#e74c3c', '#ff6b35', '#ffa500',
        '#32cd32', '#20b2aa', '#4169e1', '#9370db'
      ],
      borderWidth: 0
    }]
  };

  inquiriesByDateData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Inquiries',
      borderColor: '#c41e3a',
      backgroundColor: 'rgba(196, 30, 58, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  inquiriesByProductData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#c41e3a', '#e74c3c', '#ff6b35', '#ffa500',
        '#32cd32', '#20b2aa', '#4169e1', '#9370db'
      ],
      borderWidth: 0
    }]
  };

  inquiryStatusData: ChartConfiguration['data'] = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      borderWidth: 0
    }]
  };

  deliveryStatusData: ChartConfiguration['data'] = {
    labels: ['Delivered', 'In Transit', 'Processing'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#28a745', '#17a2b8', '#ffc107'],
      borderWidth: 0
    }]
  };

  creditDebitData: ChartConfiguration['data'] = {
    labels: ['Credit', 'Debit'],
    datasets: [{
      data: [0, 0],
      label: 'Amount',
      backgroundColor: ['#28a745', '#dc3545'],
      borderColor: ['#28a745', '#dc3545'],
      borderWidth: 1
    }]
  };

  agingStatusData: ChartConfiguration['data'] = {
    labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#28a745', '#ffc107', '#fd7e14', '#dc3545', '#6f42c1'],
      borderWidth: 0
    }]
  };

  // Chart Options
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 11 }
        }
      }
    }
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 11 }
        }
      }
    },
    // cutout: '60%'
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  loadAllData(): void {
    const customerId = localStorage.getItem('customerId');

    if (!customerId) {
      this.error = 'Customer ID not found. Please log in again.';
      this.isLoading = false;
      return;
    }

    Promise.all([
      this.dataService.getSalesOrderData(customerId).toPromise(),
      this.dataService.getInquiryData(customerId).toPromise(),
      this.dataService.getDeliveryData(customerId).toPromise(),
      this.dataService.getPaymentsData(customerId).toPromise(),
      this.dataService.getMemoData(customerId).toPromise(),
      this.dataService.getcreditData(customerId).toPromise()
    ]).then(([salesData, inquiryData, deliveryData, paymentsData, memoData, creditData]) => {
      this.salesData = salesData?.sales || [];
      this.inquiryData = inquiryData?.inquiries || [];
      this.deliveryData = deliveryData?.deliveries || [];
      this.paymentsData = paymentsData?.payments || [];
      this.memoData = memoData?.memos || [];
      this.creditData = creditData?.memos || [];

      this.filteredSalesData = [...this.salesData];
      this.filteredInquiryData = [...this.inquiryData];

      this.calculateAllKPIs();
      this.updateAllCharts();
      this.isLoading = false;
    }).catch(error => {
      this.error = 'Failed to load data. Please try again later.';
      console.error('Error loading data:', error);
      this.isLoading = false;
    });
  }

  // Sales Filters
  applySalesFilters(): void {
    this.filteredSalesData = this.salesData.filter(item => {
      let matches = true;
      
      if (this.selectedProduct !== 'All') {
        matches = matches && item.ARKTX  === this.selectedProduct;
      }
      
      if (this.selectedDateRange !== 'All') {
        const itemDate = new Date(item.ERDAT);
        const now = new Date();
        
        switch (this.selectedDateRange) {
          case 'last7days':
            matches = matches && (now.getTime() - itemDate.getTime()) <= (7 * 24 * 60 * 60 * 1000);
            break;
          case 'last30days':
            matches = matches && (now.getTime() - itemDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
            break;
          case 'last90days':
            matches = matches && (now.getTime() - itemDate.getTime()) <= (90 * 24 * 60 * 60 * 1000);
            break;
          case 'thisyear':
            matches = matches && itemDate.getFullYear() === now.getFullYear();
            break;
        }
      }
      
      return matches;
    });

    this.calculateSalesKPIs();
    this.updateSalesCharts();
  }

  // Inquiry Filters
  applyInquiryFilters(): void {
    this.filteredInquiryData = this.inquiryData.filter(item => {
      let matches = true;
      
      if (this.selectedInquiryMaterial !== 'All') {
        matches = matches && item.ARKTX  === this.selectedInquiryMaterial;
      }
      
      return matches;
    });

    this.calculateInquiryKPIs();
    this.updateInquiryCharts();
  }

  // Calculate KPIs
  calculateAllKPIs(): void {
    this.calculateSalesKPIs();
    this.calculateInquiryKPIs();
    this.calculateOthersKPIs();
  }

  calculateSalesKPIs(): void {
    this.salesKpis.totalOrders = this.filteredSalesData.length;
    this.salesKpis.totalRevenue = this.filteredSalesData.reduce((sum, order) =>
      sum + (parseFloat(order.NETWR) || 0), 0);
    this.salesKpis.avgRevenue = this.salesKpis.totalOrders ? 
      this.salesKpis.totalRevenue / this.salesKpis.totalOrders : 0;
    this.salesKpis.avgOrderValue = this.salesKpis.avgRevenue;
  }

  calculateInquiryKPIs(): void {
    this.inquiryKpis.totalInquiries = this.filteredInquiryData.length;
    this.inquiryKpis.completed = this.filteredInquiryData.filter(item => 
      item.GBSTK === 'C').length;
    this.inquiryKpis.inTransit = this.filteredInquiryData.filter(item => 
      item.GBSTK === 'B').length;
     this.inquiryKpis.pending = this.filteredInquiryData.filter(item => 
      item.GBSTK === 'A').length;
  }

  calculateOthersKPIs(): void {
    this.othersKpis.totalDeliveries = this.deliveryData.length;
    this.othersKpis.processing = this.deliveryData.filter(item => 
      item.GBSTK === 'A').length;
    this.othersKpis.totalPayments = this.paymentsData.length;
    this.othersKpis.agingItems = this.paymentsData.filter(item => 
      parseInt(item.AGING) > 30).length;
  }

  // Update Charts
  updateAllCharts(): void {
    this.updateSalesCharts();
    this.updateInquiryCharts();
    this.updateOthersCharts();
  }

  updateSalesCharts(): void {
    // Revenue by Material
    const materialRevenue = new Map<string, number>();
    this.filteredSalesData.forEach(sale => {
      const material = sale. ARKTX || 'Unknown';
      const revenue = parseFloat(sale.NETWR) || 0;
      materialRevenue.set(material, (materialRevenue.get(material) || 0) + revenue);
    });

    this.revenueByMaterialData.labels = Array.from(materialRevenue.keys());
    this.revenueByMaterialData.datasets[0].data = Array.from(materialRevenue.values());

    // Quantity by Material
    const materialQuantity = new Map<string, number>();
    this.filteredSalesData.forEach(sale => {
      const material = sale.ARKTX || 'Unknown';
      const quantity = parseFloat(sale.KWMENG) || 0;
      materialQuantity.set(material, (materialQuantity.get(material) || 0) + quantity);
    });

    this.quantityByMaterialData.labels = Array.from(materialQuantity.keys());
    this.quantityByMaterialData.datasets[0].data = Array.from(materialQuantity.values());
  }

  updateInquiryCharts(): void {
    // Inquiries by Date
    const dateMap = new Map<string, number>();
    this.filteredInquiryData.forEach(inquiry => {
      const date = new Date(inquiry.ERDAT).toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    this.inquiriesByDateData.labels = sortedDates;
    this.inquiriesByDateData.datasets[0].data = sortedDates.map(date => dateMap.get(date) || 0);

    // Inquiries by Product
    const productMap = new Map<string, number>();
    this.filteredInquiryData.forEach(inquiry => {
      const product = inquiry.ARKTX || 'Unknown';
      productMap.set(product, (productMap.get(product) || 0) + 1);
    });

    this.inquiriesByProductData.labels = Array.from(productMap.keys());
    this.inquiriesByProductData.datasets[0].data = Array.from(productMap.values());

    // Inquiry Status
    const statusCounts = { completed: 0, inProgress: 0, pending: 0 };
    this.filteredInquiryData.forEach(inquiry => {
      switch (inquiry.GBSTK) {
        case 'C': statusCounts.completed++; break;
        case 'B': statusCounts.inProgress++; break;
        default: statusCounts.pending++; break;
      }
    });

    this.inquiryStatusData.datasets[0].data = [
      statusCounts.completed,
      statusCounts.inProgress,
      statusCounts.pending
    ];
  }

  updateOthersCharts(): void {
    // Delivery Status
    const deliveryStatus = { delivered: 0, inTransit: 0, processing: 0 };
    this.deliveryData.forEach(delivery => {
      switch (delivery.GBSTK) {
        case 'C': deliveryStatus.delivered++; break;
        case 'B': deliveryStatus.inTransit++; break;
        default: deliveryStatus.processing++; break;
      }
    });

    this.deliveryStatusData.datasets[0].data = [
      deliveryStatus.delivered,
      deliveryStatus.inTransit,
      deliveryStatus.processing
    ];

    // Credit/Debit Analysis
    // let creditAmount = 0;
    // let debitAmount = 0;
    // this.memoData.forEach(memo => {
    //   const amount = parseFloat(memo.NETWR) || 0;
    //     debitAmount += amount;
    // });
    // this.creditData.forEach(credit => {
    //   const amount = parseFloat(credit.NETWR) || 0;
    //     creditAmount += amount;
    // });
    const creditAmount = this.creditData.reduce((sum, item) => sum + (parseFloat(item.NETWR) || 0), 0);
    const debitAmount = this.memoData.reduce((sum, item) => sum + (parseFloat(item.NETWR) || 0), 0);

    this.creditDebitData.datasets[0].data = [creditAmount, debitAmount];
    // Aging Status
    const agingBuckets = { current: 0, days1to30: 0, days31to60: 0, days61to90: 0, days90plus: 0 };
    this.paymentsData.forEach(payment => {
      const aging = parseInt(payment.AGING) || 0;
      if (aging <= 0) agingBuckets.current++;
      else if (aging <= 30) agingBuckets.days1to30++;
      else if (aging <= 60) agingBuckets.days31to60++;
      else if (aging <= 90) agingBuckets.days61to90++;
      else agingBuckets.days90plus++;
    });

    this.agingStatusData.datasets[0].data = [
      agingBuckets.current,
      agingBuckets.days1to30,
      agingBuckets.days31to60,
      agingBuckets.days61to90,
      agingBuckets.days90plus
    ];
  }

  // Utility Methods
  getUniqueProducts(): string[] {
    const products = new Set<string>();
    this.salesData.forEach(item => products.add(item.ARKTX));
    return Array.from(products).sort();
  }

  getUniqueInquiryMaterials(): string[] {
    const materials = new Set<string>();
    this.inquiryData.forEach(item => materials.add(item.MATNR));
    return Array.from(materials).sort();
  }

  getTopProducts(): any[] {
    const productMap = new Map<string, { units: number, revenue: number }>();
    this.filteredSalesData.forEach(order => {
      const material = order.ARKTX|| 'Unknown';
      const current = productMap.get(material) || { units: 0, revenue: 0 };
      productMap.set(material, {
        units: current.units + (parseFloat(order.KWMENG) || 0),
        revenue: current.revenue + (parseFloat(order.NETWR) || 0)
      });
    });

    return Array.from(productMap.entries())
      .map(([material, data]) => ({ material, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  getProductColor(index: number): string {
    const colors = [
      '#c41e3a', '#e74c3c', '#ff6b35', '#ffa500',
      '#32cd32', '#20b2aa', '#4169e1', '#9370db'
    ];
    return colors[index % colors.length];
  }
}