import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../core/models/project';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() projects: ProjectModel[] = [];

  currentMobileProjectIndex = 0;
  currentDesktopProjectIndex = 0;
  projectsPerGroup = 3;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.setupCarouselScrollListener();
  }

  private setupCarouselScrollListener(): void {
    const mobileCarousel = document.getElementById('projectsCarouselMobile');
    if (mobileCarousel) {
      mobileCarousel.addEventListener('scroll', () => {
        const index = Math.round(
          mobileCarousel.scrollLeft / mobileCarousel.clientWidth
        );
        if (index !== this.currentMobileProjectIndex) {
          this.currentMobileProjectIndex = index;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  getProjectGroups(): number[] {
    const totalGroups = Math.ceil(this.projects.length / this.projectsPerGroup);
    return Array.from(
      { length: totalGroups },
      (_, i) => i * this.projectsPerGroup
    );
  }

  nextProjectGroup(): void {
    const totalGroups = Math.ceil(this.projects.length / this.projectsPerGroup);
    this.currentDesktopProjectIndex =
      (this.currentDesktopProjectIndex + 1) % totalGroups;
  }

  prevProjectGroup(): void {
    const totalGroups = Math.ceil(this.projects.length / this.projectsPerGroup);
    this.currentDesktopProjectIndex =
      (this.currentDesktopProjectIndex - 1 + totalGroups) % totalGroups;
  }

  setProjectGroup(index: number): void {
    this.currentDesktopProjectIndex = index;
  }

  openProjectUrl(url: string): void {
    window.open(url, '_blank');
  }

  // Métodos para navegación móvil
  scrollCarousel(carouselId: string, direction: number): void {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });

    // Actualizar el índice después del scroll
    setTimeout(() => {
      const newIndex = Math.round(carousel.scrollLeft / cardWidth);
      if (carouselId === 'projectsCarouselMobile') {
        this.currentMobileProjectIndex = newIndex;
      }
      this.cdRef.detectChanges();
    }, 500);
  }

  scrollToCard(carouselId: string, index: number): void {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });

    if (carouselId === 'projectsCarouselMobile') {
      this.currentMobileProjectIndex = index;
    }
  }
}
