import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { IdeaModel } from '../../core/models/idea';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss'],
})
export class IdeasComponent implements OnInit, OnDestroy, AfterViewInit {
  allIdeas: IdeaModel[] = [];
  displayedIdeas: IdeaModel[] = [];
  private remainingQueue: IdeaModel[] = [];
  ideaInterval: any;
  currentIdeaChangingIndex = 0;
  isIdeaChanging = false;
  currentMobileIdeaIndex = 0;

  constructor(
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.getIdeas().subscribe((ideas) => {
      this.allIdeas = ideas;
      this.initializeIdeas();
      this.startIdeasCycle();
    });
  }

  ngAfterViewInit(): void {
    this.setupCarouselScrollListener();
  }

  ngOnDestroy(): void {
    this.stopIdeasCycle();
  }

  private initializeIdeas(): void {
    this.displayedIdeas = this.allIdeas.slice(0, 6);
    const remaining = this.allIdeas.slice(6);
    // Fisher-Yates shuffle of the remaining queue
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    this.remainingQueue = remaining;
  }

  private startIdeasCycle(): void {
    this.ideaInterval = setInterval(() => {
      this.changeRandomIdea();
    }, 10000); // Cambiar cada 10 segundos
  }

  private stopIdeasCycle(): void {
    if (this.ideaInterval) {
      clearInterval(this.ideaInterval);
    }
  }

  private changeRandomIdea(): void {
    if (this.remainingQueue.length === 0) return;
    this.isIdeaChanging = true;
    this.currentIdeaChangingIndex = Math.floor(Math.random() * 6);

    setTimeout(() => {
      const incoming = this.remainingQueue.shift()!;
      const outgoing = this.displayedIdeas[this.currentIdeaChangingIndex];
      this.remainingQueue.push(outgoing);
      this.displayedIdeas = [
        ...this.displayedIdeas.slice(0, this.currentIdeaChangingIndex),
        incoming,
        ...this.displayedIdeas.slice(this.currentIdeaChangingIndex + 1),
      ];
      this.isIdeaChanging = false;
      this.cdRef.detectChanges();
    }, 500);
  }

  private setupCarouselScrollListener(): void {
    const carousel = document.getElementById('ideasCarousel');
    if (carousel) {
      carousel.addEventListener('scroll', () => {
        const cardWidth = carousel.clientWidth;
        const index = Math.round(carousel.scrollLeft / cardWidth);
        if (index !== this.currentMobileIdeaIndex) {
          this.currentMobileIdeaIndex = index;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  scrollToIdea(index: number): void {
    const carousel = document.getElementById('ideasCarousel');
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.currentMobileIdeaIndex = index;
  }
}
