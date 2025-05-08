import { Component, Input } from '@angular/core';
import { ServiceModel } from '../../core/models';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() serviceData!: ServiceModel;

  constructor() {}
}
