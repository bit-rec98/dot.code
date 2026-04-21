import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss',
})
export class CtaComponent {
  @Output() scrollToContact = new EventEmitter<void>();

  onContactClick(): void {
    this.scrollToContact.emit();
  }
}
