import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProjectModel } from '../../core/models/project';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input() project!: ProjectModel;

  openProjectUrl(url: string): void {
    window.open(url, '_blank');
  }
}
