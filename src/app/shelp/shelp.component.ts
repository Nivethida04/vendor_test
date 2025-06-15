import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shelp',
  imports: [],
  templateUrl: './shelp.component.html',
  styleUrl: './shelp.component.scss'
})
export class ShelpComponent {
 constructor(private router: Router) {}

  // FAQ Toggle
  toggleFAQ(index: number) {
    const question = document.querySelectorAll('.faq-question')[index];
    const answer = question?.nextElementSibling;

    document.querySelectorAll('.faq-question').forEach((q, i) => {
      q.classList.remove('active');
      const ans = q.nextElementSibling;
      ans?.classList.remove('active');
    });

    question?.classList.add('active');
    answer?.classList.add('active');
  }

  // Scroll to section
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Navigation
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToSalesOrder() {
    this.router.navigate(['/sales-order']); // Adjust based on your actual route
  }

  goToDeliveries() {
    this.router.navigate(['/list-of-deliveries']); // Adjust based on your actual route
  }
}
