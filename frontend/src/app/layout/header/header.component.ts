import { Component, inject } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { ScrollSectionService } from '../../core/services/scroll-section.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private scrollService = inject(ScrollSectionService);

  isSidenavOpen = false;

  menuItems = [
    { label: 'Inicio', section: 'ctaSection' },
    { label: 'Servicios', section: 'servicesSection' },
    { label: 'Nosotros', section: 'aboutSection' },
    { label: 'Contacto', section: 'contactSection' },
  ];

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav(): void {
    this.isSidenavOpen = false;
  }

  scrollToSection(sectionId: string): void {
    this.closeSidenav();
    this.scrollService.scrollToSection(sectionId);
  }
}
