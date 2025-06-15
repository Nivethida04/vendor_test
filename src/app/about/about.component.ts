import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-about',
  imports: [FormsModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private document = inject(DOCUMENT);

  teamMembers = [
    {
      name: 'Jane Doe',
      position: 'Chief Executive Officer',
      bio: 'With over 20 years of industry experience, Jane leads our company with vision and strategic insight.',
      avatarColor: 'linear-gradient(135deg, #d13438 0%, #b92d31 100%)'
    },
    {
      name: 'John Smith',
      position: 'Chief Technology Officer',
      bio: 'John drives our technological innovation, ensuring we deliver cutting-edge solutions to our clients.',
      avatarColor: 'linear-gradient(135deg, #333 0%, #555 100%)'
    },
    {
      name: 'Sarah Johnson',
      position: 'Chief Operations Officer',
      bio: 'Sarah ensures operational excellence and efficiency across all our projects and departments.',
      avatarColor: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)'
    }
  ];

  coreValues = [
    {
      title: 'Integrity',
      description: 'We uphold the highest ethical standards in all our interactions, ensuring transparency, honesty, and accountability in everything we do.',
      icon: 'bi-shield-check'
    },
    {
      title: 'Innovation',
      description: 'We embrace creativity and forward-thinking, constantly seeking new ways to solve problems and create value for our clients and society.',
      icon: 'bi-lightbulb'
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and partnership, working together with our clients and each other to achieve shared goals and success.',
      icon: 'bi-people'
    }
  ];

  features = [
    {
      title: 'Enterprise-Grade Security',
      description: 'We implement industry-leading security measures to protect your data and ensure your peace of mind. Our multi-layered approach includes encryption, regular security audits, and compliance with international standards.',
      icon: 'bi-shield-lock'
    },
    {
      title: 'Lightning Fast Performance',
      description: 'Our solutions are optimized for speed, ensuring seamless performance and exceptional user experience. We utilize cutting-edge technologies and best practices to deliver solutions that load quickly and respond instantly.',
      icon: 'bi-lightning'
    },
    {
      title: '24/7 Dedicated Support',
      description: 'Our dedicated team is available around the clock to address your concerns and provide assistance. We offer multiple support channels and guarantee response times to ensure your business operations run smoothly.',
      icon: 'bi-headset'
    },
    {
      title: 'Innovative Solutions',
      description: 'We stay ahead of the curve, leveraging cutting-edge technologies to deliver innovative solutions. Our R&D team continuously explores emerging technologies to bring you the most advanced and effective solutions for your business needs.',
      icon: 'bi-gear'
    },
    {
      title: 'Expert Team',
      description: 'Our team of skilled professionals brings years of experience and expertise to every project. With diverse backgrounds and specialized knowledge, our experts collaborate to deliver comprehensive solutions tailored to your unique requirements.',
      icon: 'bi-people-fill'
    },
    {
      title: 'Client Satisfaction',
      description: 'We prioritize client satisfaction, ensuring that our solutions meet and exceed your expectations. Our client-centric approach focuses on understanding your needs, providing transparent communication, and delivering measurable results.',
      icon: 'bi-heart'
    }
  ];


  private updateMetaTags() {
    const head = this.document.getElementsByTagName('head')[0];
    let meta = this.document.querySelector('meta[name="description"]');
    
    if (!meta) {
      meta = this.document.createElement('meta');
      meta.setAttribute('name', 'description');
      head.appendChild(meta);
    }
    
    meta.setAttribute('content', 'Learn about KAAR TECH, our vision, mission, and the team behind our innovative technology solutions.');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  scrollToContact() {
    const contactSection = this.document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
