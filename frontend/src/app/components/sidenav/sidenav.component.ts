import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
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
