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
import { TechnologyModel } from '../../core/models/technology';

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

  // Track which technologies have been shown
  private shownTechnologies = new Set<number>();
  private windowWidth = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.updateVisibleCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['technologies'] &&
      changes['technologies'].currentValue?.length > 0
    ) {
      this.initializeShuffle();
    }
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
    this.shownTechnologies.clear();

    // Ensure we don't try to show more items than we have
    const count = Math.min(this.visibleCount, this.technologies.length);

    // Initially populate with random technologies
    this.visibleTechnologies = this.getRandomTechnologies(count).map(
      (tech) => ({
        ...tech,
        animating: true,
      })
    );

    // Mark these as shown
    this.visibleTechnologies.forEach((tech) => {
      this.shownTechnologies.add(
        this.technologies.findIndex((t) => t.id === tech.id)
      );
    });

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
   * Shuffle a random technology
   */
  private shuffleTechnology(): void {
    if (this.technologies.length <= this.visibleCount) {
      // If we have fewer technologies than visible slots, don't shuffle
      return;
    }

    // Choose a random position to replace
    const replaceIndex = Math.floor(
      Math.random() * this.visibleTechnologies.length
    );
    const currentTech = this.visibleTechnologies[replaceIndex];

    // Mark this technology as exiting
    this.visibleTechnologies[replaceIndex] = {
      ...currentTech,
      exiting: true,
      animating: false,
    };
    this.cdRef.detectChanges();

    // After exit animation completes, replace with new technology
    setTimeout(() => {
      // Get a technology that hasn't been shown recently
      const newTech = this.getNextTechnology();

      // Replace the technology with animation
      this.visibleTechnologies[replaceIndex] = {
        ...newTech,
        animating: true,
        exiting: false,
      };

      // Mark as shown
      const techIndex = this.technologies.findIndex((t) => t.id === newTech.id);
      this.shownTechnologies.add(techIndex);

      // If all technologies have been shown, reset tracking
      if (this.shownTechnologies.size >= this.technologies.length) {
        this.shownTechnologies.clear();
        // Keep currently visible ones in the shown set
        this.visibleTechnologies.forEach((tech) => {
          const idx = this.technologies.findIndex((t) => t.id === tech.id);
          this.shownTechnologies.add(idx);
        });
      }

      this.cdRef.detectChanges();

      // Remove animation classes after they complete
      setTimeout(() => {
        this.visibleTechnologies[replaceIndex] = {
          ...this.visibleTechnologies[replaceIndex],
          animating: false,
        };
        this.cdRef.detectChanges();
      }, 500); // Match with CSS animation duration
    }, 500); // Match with CSS animation duration
  }

  /**
   * Get a technology that hasn't been shown recently
   */
  private getNextTechnology(): TechnologyModel {
    const availableIndices = this.technologies
      .map((_, index) => index)
      .filter((index) => !this.shownTechnologies.has(index));

    // If all have been shown, pick any non-visible one
    if (availableIndices.length === 0) {
      const currentIds = this.visibleTechnologies.map((t) => t.id);
      const nonVisibleTechs = this.technologies.filter(
        (t) => !currentIds.includes(t.id)
      );

      if (nonVisibleTechs.length > 0) {
        return nonVisibleTechs[
          Math.floor(Math.random() * nonVisibleTechs.length)
        ];
      }

      // Fallback: just pick a random one
      return this.technologies[
        Math.floor(Math.random() * this.technologies.length)
      ];
    }

    // Get a random technology from available ones
    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return this.technologies[randomIndex];
  }

  /**
   * Get a random set of technologies
   */
  private getRandomTechnologies(count: number): TechnologyModel[] {
    // Copy and shuffle the technologies array
    const shuffled = [...this.technologies].sort(() => 0.5 - Math.random());
    // Return the first 'count' elements
    return shuffled.slice(0, count);
  }

  // Methods to pause/resume shuffle on hover
  pauseShuffle(): void {
    this.shufflePaused = true;
  }

  resumeShuffle(): void {
    this.shufflePaused = false;
  }
}
