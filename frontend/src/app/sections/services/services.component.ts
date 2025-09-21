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
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() services: ServiceModel[] = [];
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

  scrollCarousel(direction: number): void {
    const carousel = document.getElementById('servicesMobileCarousel');
    if (!carousel) return;

    // Desplaza el carrusel según la dirección
    carousel.scrollBy({
      left: carousel.clientWidth * direction,
      behavior: 'smooth',
    });
  }
}
