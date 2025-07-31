import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselService } from '../../core/services/carousel.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit, OnDestroy {

  constructor(
    public carouselService: CarouselService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Si los datos no están cargados, cargarlos
    if (this.carouselService.testimonials.length === 0) {
      this.dataService.loadTestimonials().subscribe(testimonials => {
        this.carouselService.testimonials = testimonials;
        this.carouselService.startTestimonialCarousel();
      });
    } else {
      this.carouselService.startTestimonialCarousel();
    }
  }

  ngOnDestroy(): void {
    this.carouselService.stopTestimonialCarousel();
  }

  // Métodos de conveniencia para el template
  nextTestimonial(): void {
    this.carouselService.nextTestimonial();
  }

  prevTestimonial(): void {
    this.carouselService.prevTestimonial();
  }

  setTestimonial(index: number): void {
    this.carouselService.setTestimonial(index);
  }

  stopTestimonialCarousel(): void {
    this.carouselService.stopTestimonialCarousel();
  }

  startTestimonialCarousel(): void {
    this.carouselService.startTestimonialCarousel();
  }

  get testimonials() {
    return this.carouselService.testimonials;
  }

  get currentTestimonialIndex() {
    return this.carouselService.currentTestimonialIndex;
  }
}
