import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceModel } from '../../core/models';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  @Input() serviceData!: ServiceModel;
  @Output() learnMore = new EventEmitter<ServiceModel>();

  onLearnMore(): void {
    this.learnMore.emit(this.serviceData);
  }
}
