import { Component, inject } from '@angular/core';
import { ScrollSectionService } from '../../core/services/scroll-section.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private scrollService = inject(ScrollSectionService);

  scrollToSection(sectionId: string): void {
    this.scrollService.scrollToSection(sectionId);
  }
}
