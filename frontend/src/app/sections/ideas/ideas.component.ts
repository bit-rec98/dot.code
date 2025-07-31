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
    // Mostrar las primeras 6 ideas (2x3 grid)
    this.displayedIdeas = this.allIdeas.slice(0, 6);
    this.shuffleRemainingIdeas();
  }

  private shuffleRemainingIdeas(): void {
    const displayedTitles = new Set(
      this.displayedIdeas.map((idea) => idea.title)
    );
    const remainingIdeas = this.allIdeas.filter(
      (idea) => !displayedTitles.has(idea.title)
    );

    // Fisher-Yates shuffle
    for (let i = remainingIdeas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingIdeas[i], remainingIdeas[j]] = [
        remainingIdeas[j],
        remainingIdeas[i],
      ];
    }

    this.allIdeas = [...this.displayedIdeas, ...remainingIdeas];
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
    this.isIdeaChanging = true;
    this.currentIdeaChangingIndex = Math.floor(Math.random() * 6);

    setTimeout(() => {
      const nextIdea = this.allIdeas[6];
      this.allIdeas.push(this.allIdeas.shift()!);
      this.displayedIdeas[this.currentIdeaChangingIndex] = nextIdea;
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
