import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { TechnologyModel } from '../../core/models/technology';
import { LogoCacheService } from '../../core/services/logo-cache.service';

// Extended model to track animation states
interface AnimatedTechnology extends TechnologyModel {
  animating?: boolean;
  exiting?: boolean;
}

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss'],
})
export class TechnologiesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() technologies: TechnologyModel[] = [];

  // Shuffle control
  visibleTechnologies: AnimatedTechnology[] = [];
  visibleCount = 5; // Default reduced to 5 items
  shuffleInterval: any;
  shuffleSpeed = 3500; // Shuffle every 3.5 seconds
  shufflePaused = false;

  // Resolved SVG markup keyed by logo URL
  logoSvgMap = new Map<string, SafeHtml>();

  // Queue of technologies not yet shown in the current cycle
  private queue: TechnologyModel[] = [];
  private windowWidth = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private logoCache: LogoCacheService
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.updateVisibleCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['technologies'] &&
      changes['technologies'].currentValue?.length > 0
    ) {
      this.preloadLogos();
      this.initializeShuffle();
    }
  }

  private preloadLogos(): void {
    this.technologies.forEach((tech) => {
      this.logoCache.getSvg(tech.logo).subscribe((svg) => {
        this.logoSvgMap.set(tech.logo, svg);
        this.cdRef.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.stopShuffle();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowWidth = window.innerWidth;
    this.updateVisibleCount();

    // After updating count, reinitialize
    if (this.technologies.length > 0) {
      this.initializeShuffle();
    }
  }

  /**
   * Updates the number of visible technologies based on screen size
   * Reduced to show only 5 items on larger screens and 1 on mobile
   */
  private updateVisibleCount(): void {
    // Simplified breakpoints with reduced counts
    if (this.windowWidth >= 1024) {
      this.visibleCount = 5; // Desktop - 5 items
    } else if (this.windowWidth >= 768) {
      this.visibleCount = 3; // Tablet - 3 items
    } else if (this.windowWidth >= 640) {
      this.visibleCount = 2; // Small tablet - 2 items
    } else {
      this.visibleCount = 1; // Mobile - 1 item
    }
  }

  /**
   * Initialize the shuffle effect
   */
  private initializeShuffle(): void {
    if (!this.technologies || this.technologies.length === 0) {
      return;
    }

    this.stopShuffle();

    // Ensure we don't try to show more items than we have
    const count = Math.min(this.visibleCount, this.technologies.length);

    // Shuffle all technologies and use the first `count` as initial visible set
    const shuffled = this.fisherYates([...this.technologies]);
    this.visibleTechnologies = shuffled.splice(0, count).map((tech) => ({
      ...tech,
      animating: true,
    }));

    // Remaining technologies become the queue for upcoming swaps
    this.queue = shuffled;

    // Start the shuffle
    this.startShuffle();
    this.cdRef.detectChanges();
  }

  /**
   * Start the shuffle interval
   */
  private startShuffle(): void {
    this.stopShuffle();

    this.shuffleInterval = setInterval(() => {
      if (!this.shufflePaused) {
        this.shuffleTechnology();
      }
    }, this.shuffleSpeed);
  }

  /**
   * Stop the shuffle interval
   */
  private stopShuffle(): void {
    if (this.shuffleInterval) {
      clearInterval(this.shuffleInterval);
      this.shuffleInterval = null;
    }
  }

  /**
   * Swap a random visible slot with the next technology from the queue.
   * The evicted technology is placed back at the end of the queue.
   * When the queue is exhausted it is refilled and re-shuffled.
   */
  private shuffleTechnology(): void {
    if (this.technologies.length <= this.visibleCount) {
      return;
    }

    // Refill queue when empty (re-shuffle to avoid repeating the previous order)
    if (this.queue.length === 0) {
      this.queue = this.fisherYates(
        this.technologies.filter(
          (t) => !this.visibleTechnologies.some((v) => v.id === t.id)
        )
      );
    }

    const replaceIndex = Math.floor(
      Math.random() * this.visibleTechnologies.length
    );
    const evicted = this.visibleTechnologies[replaceIndex];
    const incoming = this.queue.shift()!;

    // Push evicted technology to the end of the queue
    this.queue.push({ ...evicted, animating: undefined, exiting: undefined } as TechnologyModel);

    // Trigger exit animation
    this.visibleTechnologies[replaceIndex] = { ...evicted, exiting: true, animating: false };
    this.cdRef.detectChanges();

    setTimeout(() => {
      this.visibleTechnologies[replaceIndex] = { ...incoming, animating: true, exiting: false };
      this.cdRef.detectChanges();

      setTimeout(() => {
        this.visibleTechnologies[replaceIndex] = {
          ...this.visibleTechnologies[replaceIndex],
          animating: false,
        };
        this.cdRef.detectChanges();
      }, 500);
    }, 500);
  }

  /**
   * Fisher-Yates in-place shuffle, returns the same array.
   */
  private fisherYates<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Methods to pause/resume shuffle on hover
  pauseShuffle(): void {
    this.shufflePaused = true;
  }

  resumeShuffle(): void {
    this.shufflePaused = false;
  }
}
