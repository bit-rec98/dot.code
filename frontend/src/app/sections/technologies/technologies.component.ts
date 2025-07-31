import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnologyModel } from '../../core/models/technology';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss'],
})
export class TechnologiesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() technologies: TechnologyModel[] = [];

  // Control del carrusel
  currentIndex = 0;
  carouselInterval: any;
  itemsPerView = 1; // Por defecto móvil
  private windowWidth = 0;

  // Array duplicado para scroll infinito
  displayedTechnologies: TechnologyModel[] = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.updateItemsPerView();
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowWidth = window.innerWidth;
    this.updateItemsPerView();
    this.resetCarousel();
  }

  private updateItemsPerView(): void {
    if (this.windowWidth >= 640) {
      this.itemsPerView = 3; // Desktop: 3 items
    } else {
      this.itemsPerView = 1; // Mobile: 1 item
    }
  }

  private initializeCarousel(): void {
    if (this.technologies.length === 0) return;

    // Duplicar el array para crear el efecto infinito
    // Necesitamos al menos 3 copias para el scroll suave
    this.displayedTechnologies = [
      ...this.technologies,
      ...this.technologies,
      ...this.technologies,
    ];
  }

  private startCarousel(): void {
    this.stopCarousel(); // Limpiar cualquier intervalo previo

    this.carouselInterval = setInterval(() => {
      this.nextTechnology();
    }, 3000); // Cambiar cada 3 segundos
  }

  private stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  private resetCarousel(): void {
    this.currentIndex = 0;
    this.initializeCarousel();
    this.startCarousel();
    this.cdRef.detectChanges();
  }

  private nextTechnology(): void {
    const maxIndex = this.technologies.length;
    this.currentIndex = (this.currentIndex + 1) % maxIndex;

    const carousel = document.getElementById('techCarousel');
    if (carousel) {
      const itemWidth = carousel.clientWidth / this.itemsPerView;
      const scrollPosition = this.currentIndex * itemWidth;

      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });

      // Reset para scroll infinito
      if (this.currentIndex === 0) {
        setTimeout(() => {
          carousel.scrollTo({
            left: 0,
            behavior: 'auto',
          });
        }, 500);
      }
    }
  }

  // Método para pausar/reanudar el carrusel al hacer hover
  onMouseEnter(): void {
    this.stopCarousel();
  }

  onMouseLeave(): void {
    this.startCarousel();
  }
}
