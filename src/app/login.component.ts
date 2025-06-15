import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  showContactPopup = false;
  showPassword: boolean = false;
  showAboutPopup = false;

  customerId = '';
  password = '';

  constructor(private router: Router, private loginService: LoginService) {}

  login() {
    // Placeholder validation
    
    this.loginService.login(this.customerId, this.password).subscribe({
      next: (res) => {
      console.log('Login response:', res);
      if (res.message === 'Login successful.') {
        localStorage.setItem('customerId', res.customerId);
        this.router.navigate(['/dashboard']);
      } else {
        alert(res.message); // Show the appropriate message and stay on login
      }
    },
      error: (err) => {
        console.error('Login error:', err);
        alert(err.error?.error || 'Login failed');
      }
    });
  }

  resetPassword() {
    alert("Redirect to reset password page or modal.");
  }
  resetFields() {
    this.customerId = '';
    this.password = '';
  }
  openAboutPopup() {
    this.showAboutPopup = true;
    document.body.style.overflow = 'hidden';
  }

  closeAboutPopup() {
    this.showAboutPopup = false;
    document.body.style.overflow = 'auto';
  }

  openContactPopup() {
    this.showContactPopup = true;
    document.body.style.overflow = 'hidden';
  }

  closeContactPopup() {
    this.showContactPopup = false;
    document.body.style.overflow = 'auto';
  }
openMessagingApp(): void {
  const userAgent = navigator.userAgent || navigator.vendor;

  // Use WhatsApp or SMS if on mobile
  if (/android/i.test(userAgent)) {
    window.open('sms:+919876543210', '_blank'); // Opens default SMS app on Android
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    // Safe check for MSStream
    const isIOS = typeof window !== 'undefined' && !('MSStream' in window);
    if (isIOS) {
      window.open('sms:+919876543210', '_blank');
    }
  } else {
    alert('Live chat is available only on mobile devices.');
  }
}
}