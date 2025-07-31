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
import { ProjectModel } from '../../core/models/project';
import { ProjectCardComponent } from '../../components';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() projects: ProjectModel[] = [];

  currentProjectIndex = 0;
  projectsPerGroup = 3;
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

  // Método auxiliar para la lógica de indicadores en desktop
  isCurrentGroup(index: number): boolean {
    return Math.floor(this.currentProjectIndex / 3) === Math.floor(index / 3);
  }

  private setupCarouselScrollListener(): void {
    const projectsCarousel = document.getElementById('projectsCarousel');
    if (projectsCarousel) {
      projectsCarousel.addEventListener('scroll', () => {
        if (this.isDesktopView()) {
          // En desktop, cada grupo tiene 3 elementos
          const cardWidth = projectsCarousel.clientWidth / 3;
          const index = Math.round(projectsCarousel.scrollLeft / cardWidth);
          if (index !== this.currentProjectIndex) {
            this.currentProjectIndex = index;
            this.cdRef.detectChanges();
          }
        } else {
          // En móvil, cada tarjeta ocupa todo el ancho
          const cardWidth = projectsCarousel.clientWidth;
          const index = Math.round(projectsCarousel.scrollLeft / cardWidth);
          if (index !== this.currentProjectIndex) {
            this.currentProjectIndex = index;
            this.cdRef.detectChanges();
          }
        }
      });
    }
  }

  nextProjectGroup(): void {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;

    if (this.isDesktopView()) {
      carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
    }

    setTimeout(() => {
      if (this.isDesktopView()) {
        const cardWidth = carousel.clientWidth / 3;
        this.currentProjectIndex = Math.round(carousel.scrollLeft / cardWidth);
      }
      this.cdRef.detectChanges();
    }, 500);
  }

  prevProjectGroup(): void {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;

    if (this.isDesktopView()) {
      carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
    }

    setTimeout(() => {
      if (this.isDesktopView()) {
        const cardWidth = carousel.clientWidth / 3;
        this.currentProjectIndex = Math.round(carousel.scrollLeft / cardWidth);
      }
      this.cdRef.detectChanges();
    }, 500);
  }

  scrollToCard(index: number): void {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.currentProjectIndex = index;
  }

  scrollToCardGroup(startIndex: number): void {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;

    // Desplazar al grupo (cada 3 elementos)
    const groupIndex = Math.floor(startIndex / 3);
    carousel.scrollTo({
      left: carousel.clientWidth * groupIndex,
      behavior: 'smooth',
    });
    this.currentProjectIndex = startIndex;
  }
}
