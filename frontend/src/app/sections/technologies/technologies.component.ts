import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { TechnologyModel } from '../../core/models/technology';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss'],
})
export class TechnologiesComponent implements OnInit {
  technologies: TechnologyModel[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.technologies = this.dataService.getTechnologies();
  }
}
