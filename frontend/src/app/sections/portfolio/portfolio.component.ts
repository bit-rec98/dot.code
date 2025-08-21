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
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() projects: ProjectModel[] = [];
  private windowWidth = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowWidth = window.innerWidth;
    this.cdRef.detectChanges();
  }

  isDesktopView(): boolean {
    return this.windowWidth >= 640; // 640px es el punto de quiebre de 'sm' en Tailwind
  }

  nextProjectGroup(): void {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;

    // Desplaza el carrusel según la dirección
    carousel.scrollBy({
      left: carousel.clientWidth,
      behavior: 'smooth',
    });
  }

  prevProjectGroup(): void {
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;

    // Desplaza el carrusel según la dirección
    carousel.scrollBy({
      left: -carousel.clientWidth,
      behavior: 'smooth',
    });
  }
}
