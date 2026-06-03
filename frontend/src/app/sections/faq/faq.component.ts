import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

import { FAQModel } from '../../core/models/faq';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @Input() allFAQs: FAQModel[] = [];
  @Output() scrollToContact = new EventEmitter<void>();

  displayedFAQs: FAQModel[] = [];
  private remainingQueue: FAQModel[] = [];
  faqInterval: any;
  currentFAQChangingIndex = 0;
  isFAQChanging = false;
  currentMobileFAQIndex = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupCarouselScrollListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allFAQs'] && changes['allFAQs'].currentValue?.length > 0) {
      this.initializeFAQs();
      this.startFAQsCycle();
    }
  }

  ngOnDestroy(): void {
    this.stopFAQsCycle();
  }

  private initializeFAQs(): void {
    this.displayedFAQs = this.allFAQs.slice(0, 6);
    const remaining = this.allFAQs.slice(6);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    this.remainingQueue = remaining;
  }

  private startFAQsCycle(): void {
    this.faqInterval = setInterval(() => {
      this.changeRandomFAQ();
    }, 12000);
  }

  private stopFAQsCycle(): void {
    if (this.faqInterval) {
      clearInterval(this.faqInterval);
    }
  }

  private changeRandomFAQ(): void {
    if (this.remainingQueue.length === 0) return;
    this.isFAQChanging = true;
    this.currentFAQChangingIndex = Math.floor(Math.random() * 6);

    setTimeout(() => {
      const incoming = this.remainingQueue.shift()!;
      const outgoing = this.displayedFAQs[this.currentFAQChangingIndex];
      this.remainingQueue.push(outgoing);
      this.displayedFAQs = [
        ...this.displayedFAQs.slice(0, this.currentFAQChangingIndex),
        incoming,
        ...this.displayedFAQs.slice(this.currentFAQChangingIndex + 1),
      ];
      this.isFAQChanging = false;
      this.cdRef.detectChanges();
    }, 500);
  }

  private setupCarouselScrollListener(): void {
    const carousel = document.getElementById('faqCarousel');
    if (carousel) {
      carousel.addEventListener('scroll', () => {
        const cardWidth = carousel.clientWidth;
        const index = Math.round(carousel.scrollLeft / cardWidth);
        if (index !== this.currentMobileFAQIndex) {
          this.currentMobileFAQIndex = index;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  scrollToFAQ(index: number): void {
    const carousel = document.getElementById('faqCarousel');
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.currentMobileFAQIndex = index;
  }

  onContactClick(): void {
    this.scrollToContact.emit();
  }
}
