import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav-bar',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent implements OnInit {
  isSidebarOpen = false; // Default to collapsed (icons only)
  isFinanceOpen = false;
  private mobileBreakpoint = 768;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadChatbotScript();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const isMobileView = window.innerWidth <= this.mobileBreakpoint;
      
      // On mobile, sidebar should be hidden by default
      if (isMobileView && this.isSidebarOpen) {
        // Keep current state on mobile
      } else if (!isMobileView) {
        // On desktop, ensure sidebar behavior is correct
        // isSidebarOpen = false means collapsed (icons only)
        // isSidebarOpen = true means expanded (full width)
      }
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.isSidebarOpen = false;
    }
  }

  handleLinkClick(): void {
    // Close sidebar on mobile when a link is clicked
    if (this.isMobile()) {
      this.isSidebarOpen = false;
    }
  }

  isMobile(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= this.mobileBreakpoint;
    }
    return false;
  }

  toggleFinanceDropdown(): void {
    this.isFinanceOpen = !this.isFinanceOpen;
  }

  isFinanceRouteActive(): boolean {
    const url = this.router.url;
    return url.includes('/invoice') || url.includes('/payage') || url.includes('/credit');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  private loadChatbotScript(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/0196f60ff58e78b08d574de940c8088fd862/embed.js?skipWelcome=1&maximizable=1';
    script.async = true;
    script.defer = true;

    const container = document.getElementById('chatbot-container');
    if (container) {
      container.appendChild(script);
    }
  }
}