import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ProjectModel } from '../../core/models/project';
import { FAQModel } from '../../core/models/faq';
import {
  CtaComponent,
  FaqComponent,
  PortfolioComponent,
  ServicesComponent,
  AboutUsComponent,
  TechnologiesComponent,
  IdeasComponent,
} from '../../sections';
import { ServiceModel } from '../../core/models';
import { ContactComponent } from '../../sections/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CtaComponent,
    ServicesComponent,
    PortfolioComponent,
    AboutUsComponent,
    TechnologiesComponent,
    FaqComponent,
    IdeasComponent,
    ContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  services: ServiceModel[] = [];
  projects: ProjectModel[] = [];
  faqs: FAQModel[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataService.getServices().subscribe(services => {
      this.services = services;
    });
    this.dataService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
    this.dataService.getFAQs().subscribe(faqs => {
      this.faqs = faqs;
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  onContactClick(): void {
    this.scrollToSection('contactSection');
  }
}
