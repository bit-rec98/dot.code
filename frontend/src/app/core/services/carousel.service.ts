import { Injectable } from '@angular/core';
import { TestimonialModel } from '../models/testimonial';
import { TechnologyModel } from '../models/technology';
import { ProjectModel } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  // carrusel de servicios móvil
  currentServiceIndex = 0;

  // Control del carrusel de proyectos - versión móvil
  currentMobileProjectIndex = 0;

  // Control del carrusel de proyectos - versión desktop
  currentDesktopProjectIndex = 0;
  projectsPerGroup = 3;

  // Control del carrusel de proyectos
  currentProjectIndex = 0;
  projectsPerView = 3;
  projectsInterval: any;

  // Carrusel de testimonios
  testimonials: TestimonialModel[] = [];
  currentTestimonialIndex = 0;
  testimonialInterval: any;

  // Carrusel de tecnologías
  technologies: TechnologyModel[] = [];
  currentTechIndex = 0;
  techInterval: any;
  techItemsPerView = 4;

  // Datos de proyectos
  projects: ProjectModel[] = [];

  constructor() {}

  /**
   * Inicializar datos del carrusel
   */
  initializeData(testimonials: TestimonialModel[], technologies: TechnologyModel[], projects: ProjectModel[]): void {
    this.testimonials = testimonials;
    this.technologies = technologies;
    this.projects = projects;
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de servicios
   * ========================================
   */
  /**
   * Método para avanzar o retroceder en un carrusel basado en scroll
   * @param carouselId ID del elemento carrusel
   * @param direction 1 para avanzar, -1 para retroceder
   */
  scrollCarousel(carouselId: string, direction: number): void {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });

    // Actualizar índices para los indicadores
    if (carouselId === 'servicesMobileCarousel') {
      setTimeout(() => {
        this.currentServiceIndex = Math.round(carousel.scrollLeft / cardWidth);
      }, 500);
    } else if (carouselId === 'projectsCarousel') {
      setTimeout(() => {
        this.currentProjectIndex = Math.round(carousel.scrollLeft / cardWidth);
      }, 500);
    }
  }

  /**
   * Método para ir a una tarjeta específica del carrusel
   * @param carouselId ID del elemento carrusel
   * @param index Índice de la tarjeta a mostrar
   */
  scrollToCard(carouselId: string, index: number): void {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });

    if (carouselId === 'servicesMobileCarousel') {
      this.currentServiceIndex = index;
    } else if (carouselId === 'projectsCarousel') {
      this.currentProjectIndex = index;
    }
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de proyectos
   * ========================================
   */
  startProjectsCarousel(): void {
    this.projectsInterval = setInterval(() => {
      this.nextProjects();
    }, 8000); // Cambiar cada 8 segundos
  }

  stopProjectsCarousel(): void {
    if (this.projectsInterval) {
      clearInterval(this.projectsInterval);
    }
  }

  nextProjects(): void {
    const maxIndex = Math.ceil(this.projects.length / this.projectsPerView) - 1;
    this.currentProjectIndex = (this.currentProjectIndex + 1) % (maxIndex + 1);
  }

  prevProjects(): void {
    const maxIndex = Math.ceil(this.projects.length / this.projectsPerView) - 1;
    this.currentProjectIndex =
      (this.currentProjectIndex - 1 + maxIndex + 1) % (maxIndex + 1);
  }

  // Obtener el número total de páginas para el carrusel de proyectos
  get totalProjectPages(): number {
    return Math.ceil(this.projects.length / this.projectsPerView);
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de proyectos
   * ========================================
   */
  /**
   * Obtiene los índices iniciales de cada grupo de proyectos
   * @returns Array con los índices de inicio de cada grupo
   */
  getProjectGroups(): number[] {
    const totalGroups = Math.ceil(this.projects.length / this.projectsPerGroup);
    return Array.from(
      { length: totalGroups },
      (_, i) => i * this.projectsPerGroup
    );
  }

  /**
   * Avanza al siguiente grupo de proyectos en vista desktop
   */
  nextProjectGroup(): void {
    const totalGroups = Math.ceil(this.projects.length / this.projectsPerGroup);
    this.currentDesktopProjectIndex =
      (this.currentDesktopProjectIndex + 1) % totalGroups;
  }

  /**
   * Retrocede al grupo anterior de proyectos en vista desktop
   */
  prevProjectGroup(): void {
    const totalGroups = Math.ceil(this.projects.length / this.projectsPerGroup);
    this.currentDesktopProjectIndex =
      (this.currentDesktopProjectIndex - 1 + totalGroups) % totalGroups;
  }

  /**
   * Establece un grupo específico de proyectos en vista desktop
   */
  setProjectGroup(index: number): void {
    this.currentDesktopProjectIndex = index;
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de testimonios
   * ========================================
   */
  startTestimonialCarousel(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000); // Cambiar cada 5 segundos
  }

  stopTestimonialCarousel(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  nextTestimonial(): void {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  setTestimonial(index: number): void {
    this.currentTestimonialIndex = index;
  }

  // Ajustar items por vista según tamaño de ventana
  adjustTechItemsPerView(): void {
    if (window.innerWidth < 640) {
      // móvil
      this.techItemsPerView = 1;
    } else if (window.innerWidth < 1024) {
      // tablet
      this.techItemsPerView = 2;
    } else {
      // desktop
      this.techItemsPerView = 4;
    }
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de tecnologías
   * ========================================
   */
  startTechCarousel(): void {
    this.techInterval = setInterval(() => {
      this.nextTech();
    }, 3000); // Cambiar cada 3 segundos
  }

  stopTechCarousel(): void {
    if (this.techInterval) {
      clearInterval(this.techInterval);
    }
  }

  nextTech(): void {
    this.currentTechIndex =
      (this.currentTechIndex + 1) %
      (this.technologies.length - this.techItemsPerView + 1);
  }

  prevTech(): void {
    this.currentTechIndex =
      (this.currentTechIndex -
        1 +
        this.technologies.length -
        this.techItemsPerView +
        1) %
      (this.technologies.length - this.techItemsPerView + 1);
  }

  setTech(index: number): void {
    this.currentTechIndex = index;
  }

  // Comprobar si un índice es visible en la vista actual
  isTechVisible(index: number): boolean {
    return (
      index >= this.currentTechIndex &&
      index < this.currentTechIndex + this.techItemsPerView
    );
  }
}
