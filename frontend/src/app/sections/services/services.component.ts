import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
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
export class ServicesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() services: ServiceModel[] = [];

  currentServiceIndex = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.setupCarouselScrollListener();
  }

  private setupCarouselScrollListener(): void {
    const servicesCarousel = document.getElementById('servicesMobileCarousel');
    if (servicesCarousel) {
      servicesCarousel.addEventListener('scroll', () => {
        const index = Math.round(
          servicesCarousel.scrollLeft / servicesCarousel.clientWidth
        );
        if (index !== this.currentServiceIndex) {
          this.currentServiceIndex = index;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  scrollCarousel(direction: number): void {
    const carousel = document.getElementById('servicesMobileCarousel');
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });

    setTimeout(() => {
      this.currentServiceIndex = Math.round(carousel.scrollLeft / cardWidth);
    }, 500);
  }

  scrollToCard(index: number): void {
    const carousel = document.getElementById('servicesMobileCarousel');
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.currentServiceIndex = index;
  }
}
