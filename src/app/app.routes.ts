import { Routes } from '@angular/router';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile.component';
import { InquiryComponent } from './inquiry/inquiry.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { ListOfDeliveriesComponent } from './list-of-deliveries/list-of-deliveries.component';
import { PayageComponent } from './payage/payage.component';
import { CreditDebitComponent } from './credit-debit/credit-debit.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login.component';
import { ShelpComponent } from './shelp/shelp.component';
import { CreditComponent } from './credit/credit.component';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { OverallComponent } from './overall/overall.component';
import { InquiryDetailComponent } from './inquiry-detail/inquiry-detail.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inquiry-detail',
    loadComponent: () => import('./inquiry-detail/inquiry-detail.component').then(m => m.InquiryDetailComponent)
  },
  {
    path: 'sales-detail',
    loadComponent: () => import('./sales-detail/sales-detail.component').then(m => m.SalesDetailComponent)
  },
  {
    path: 'delivery-detail',
    loadComponent: () => import('./delivery-detail/delivery-detail.component').then(m => m.DeliveryDetailComponent)
  },
  {
    path: '',
    component: SideNavBarComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'inquiry', component: InquiryComponent },
      { path: 'inquiry-detail', component: InquiryDetailComponent},
      { path: 'sales-order', component: SalesOrderComponent },
      { path: 'list-of-deliveries', component: ListOfDeliveriesComponent },
      { path: 'invoice_data', component: InvoicelistComponent },
      { path: 'payage', component: PayageComponent },
      { path: 'credit-debit', component: CreditDebitComponent},
      { path: 'about', component: AboutComponent},
      { path: 'contact', component: ContactComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'shelp', component: ShelpComponent },
      { path: 'credit', component: CreditComponent },
      { path: 'overall', component: OverallComponent },
      
    ]
  },
];