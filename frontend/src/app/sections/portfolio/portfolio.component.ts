import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

import { ProjectModel } from '../../core/models/project';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() projects: ProjectModel[] = [];
  @Output() scrollToContact = new EventEmitter<void>();
  private windowWidth = 0;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
  }

  ngOnDestroy(): void { }

  ngAfterViewInit(): void { }

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

  onContactClick(): void {
    this.scrollToContact.emit();
  }
}
