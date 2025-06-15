import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
isLoading = true;
  isSubmitting = false;
  activeFaq = -1;

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  };

  contactMethods = [
    {
      type: 'phone',
      icon: 'bi-telephone',
      title: 'Call Us',
      description: 'Speak directly with our customer care team for immediate assistance.',
      value: '+91 98765 43210',
      availability: 'Mon-Fri, 9 AM - 6 PM IST',
      actionText: 'Call Now'
    },
    {
      type: 'email',
      icon: 'bi-envelope',
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours.',
      value: 'support@kaartech.com',
      availability: null,
      actionText: 'Send Email'
    },
    {
      type: 'chat',
      icon: 'bi-chat-dots',
      title: 'Live Chat',
      description: 'Get instant help from our support agents via live chat.',
      value: 'Available Now',
      availability: '9 AM - 6 PM IST',
      actionText: 'Start Chat'
    }
  ];
  scheduleVisit(): void {
    alert('✅ Your schedule is fixed! Our team will contact you shortly.');
  }

  ngOnInit() {
    // Simulate loading time for smooth animation
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  handleMethodAction(type: string) {
    switch (type) {
      case 'phone':
        window.open('tel:+919876543210', '_self');
        break;
      case 'email':
        window.open('mailto:support@kaartech.com', '_self');
        break;
      case 'chat':
        // Implement chat functionality
        console.log('Opening chat...');
        break;
    }
  }

  submitForm() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.formData);
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      this.resetForm();
      this.isSubmitting = false;
    }, 2000);
  }

  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    };
  }

  toggleFaq(index: number) {
    this.activeFaq = this.activeFaq === index ? -1 : index;
  }
}
