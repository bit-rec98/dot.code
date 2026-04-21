import { Component } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isSidenavOpen = false;

  menuItems = [
    { label: 'Inicio', section: 'ctaSection' },
    { label: 'Servicios', section: 'servicesSection' },
    { label: 'Nosotros', section: 'aboutSection' },
    { label: 'Contacto', section: 'contactSection' },
  ];

  constructor(private viewportScroller: ViewportScroller) {}

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav(): void {
    this.isSidenavOpen = false;
  }

  scrollToSection(sectionId: string): void {
    // Cierra el sidenav si está abierto
    this.closeSidenav();

    // Pequeño retraso para asegurar que la navegación funcione correctamente
    setTimeout(() => {
      // Desplazamiento suave a la sección
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }
}
