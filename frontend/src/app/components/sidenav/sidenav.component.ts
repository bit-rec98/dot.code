import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  menuItems = [
    { label: 'Home', section: 'ctaSection' },
    { label: 'Services', section: 'servicesSection' },
    { label: 'About', section: 'aboutSection' },
    { label: 'Contact', section: 'contactSection' },
  ];

  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  close(): void {
    this.closeMenu.emit();
  }

  scrollToSection(sectionId: string): void {
    // Cierra el sidenav
    this.close();

    // Pequeño retraso para asegurar que la navegación funcione correctamente
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 300);
  }
}
