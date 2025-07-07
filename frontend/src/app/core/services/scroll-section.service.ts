import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollSectionService {
  /**
   * Método para navegar a una sección específica de la página
   * - Utiliza el ID de la sección para encontrar el elemento en el DOM
   * @param sectionId
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
