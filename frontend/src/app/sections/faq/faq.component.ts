import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQModel } from '../../core/models/faq';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, OnDestroy, OnChanges {
  @Input() allFAQs: FAQModel[] = [];
  @Output() scrollToContact = new EventEmitter<void>();

  displayedFAQs: FAQModel[] = [];
  faqInterval: any;
  currentFAQChangingIndex = 0;
  isFAQChanging = false;

  ngOnInit(): void {}

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
    this.shuffleRemainingFAQs();
  }

  private shuffleRemainingFAQs(): void {
    const displayedQuestions = new Set(
      this.displayedFAQs.map((faq) => faq.question)
    );
    const remainingFAQs = this.allFAQs.filter(
      (faq) => !displayedQuestions.has(faq.question)
    );

    // Fisher-Yates shuffle algorithm
    for (let i = remainingFAQs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingFAQs[i], remainingFAQs[j]] = [
        remainingFAQs[j],
        remainingFAQs[i],
      ];
    }

    this.allFAQs = [...this.displayedFAQs, ...remainingFAQs];
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
    this.isFAQChanging = true;
    this.currentFAQChangingIndex = Math.floor(Math.random() * 6);

    setTimeout(() => {
      const nextFAQ = this.allFAQs[6];
      this.allFAQs.push(this.allFAQs.shift()!);
      this.displayedFAQs[this.currentFAQChangingIndex] = nextFAQ;
      this.isFAQChanging = false;
    }, 500);
  }

  onContactClick(): void {
    this.scrollToContact.emit();
  }
}
