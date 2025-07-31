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
import { ServiceCardComponent } from '../../components';
import { ServiceModel } from '../../core/models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() services: ServiceModel[] = [];
  currentServiceIndex = 0;
  private windowWidth = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.setupCarouselScrollListener();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowWidth = window.innerWidth;
    this.cdRef.detectChanges();
  }

  isDesktopView(): boolean {
    return this.windowWidth >= 640; // 640px es el punto de quiebre de 'sm' en Tailwind
  }

  // Nuevo método auxiliar para la lógica de indicadores en desktop
  isCurrentGroup(index: number): boolean {
    return Math.floor(this.currentServiceIndex / 3) === Math.floor(index / 3);
  }

  private setupCarouselScrollListener(): void {
    const servicesCarousel = document.getElementById('servicesMobileCarousel');
    if (servicesCarousel) {
      servicesCarousel.addEventListener('scroll', () => {
        if (this.isDesktopView()) {
          // En desktop, cada grupo tiene 3 elementos
          const cardWidth = servicesCarousel.clientWidth / 3;
          const index = Math.round(servicesCarousel.scrollLeft / cardWidth);
          if (index !== this.currentServiceIndex) {
            this.currentServiceIndex = index;
            this.cdRef.detectChanges();
          }
        } else {
          // En móvil, cada tarjeta ocupa todo el ancho
          const cardWidth = servicesCarousel.clientWidth;
          const index = Math.round(servicesCarousel.scrollLeft / cardWidth);
          if (index !== this.currentServiceIndex) {
            this.currentServiceIndex = index;
            this.cdRef.detectChanges();
          }
        }
      });
    }
  }

  scrollCarousel(direction: number): void {
    const carousel = document.getElementById('servicesMobileCarousel');
    if (!carousel) return;

    if (this.isDesktopView()) {
      // En desktop, desplaza 3 elementos a la vez
      carousel.scrollBy({
        left: carousel.clientWidth * direction,
        behavior: 'smooth',
      });
    } else {
      // En móvil, desplaza 1 elemento
      carousel.scrollBy({
        left: carousel.clientWidth * direction,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      if (this.isDesktopView()) {
        const cardWidth = carousel.clientWidth / 3;
        this.currentServiceIndex = Math.round(carousel.scrollLeft / cardWidth);
      } else {
        this.currentServiceIndex = Math.round(
          carousel.scrollLeft / carousel.clientWidth
        );
      }
      this.cdRef.detectChanges();
    }, 500);
  }

  scrollToCard(index: number): void {
    const carousel = document.getElementById('servicesMobileCarousel');
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.currentServiceIndex = index;
  }

  scrollToCardGroup(startIndex: number): void {
    const carousel = document.getElementById('servicesMobileCarousel');
    if (!carousel) return;

    // Desplazar al grupo (cada 3 elementos)
    const groupIndex = Math.floor(startIndex / 3);
    carousel.scrollTo({
      left: carousel.clientWidth * groupIndex,
      behavior: 'smooth',
    });
    this.currentServiceIndex = startIndex;
  }
}
