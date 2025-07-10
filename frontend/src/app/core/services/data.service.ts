import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProjectModel } from '../models/project';
import { TechnologyModel } from '../models/technology';
import { IdeaModel } from '../models/idea';
import { FAQModel } from '../models/faq';
import { ServiceModel } from '../models';

interface UIData {
  services: ServiceModel[];
  projects: ProjectModel[];
  technologies: TechnologyModel[];
  ideas: IdeaModel[];
  faqs: FAQModel[];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'data/ui.json';
  private dataCache$ = new BehaviorSubject<UIData | null>(null);

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData(): void {
    this.http.get<UIData>(this.dataUrl).subscribe({
      next: (data) => {
        this.dataCache$.next(data);
      },
      error: (error) => {
        console.error('Error loading UI data:', error);
        // Datos de fallback en caso de error
        this.dataCache$.next(this.getFallbackData());
      },
    });
  }

  private getFallbackData(): UIData {
    return {
      services: [],
      projects: [],
      technologies: [],
      ideas: [],
      faqs: [],
    };
  }

  getServices(): Observable<ServiceModel[]> {
    return this.dataCache$.pipe(
      map((data) => data?.services || []),
      shareReplay(1)
    );
  }

  getProjects(): Observable<ProjectModel[]> {
    return this.dataCache$.pipe(
      map((data) => data?.projects || []),
      shareReplay(1)
    );
  }

  getTechnologies(): Observable<TechnologyModel[]> {
    return this.dataCache$.pipe(
      map((data) => data?.technologies || []),
      shareReplay(1)
    );
  }

  getIdeas(): Observable<IdeaModel[]> {
    return this.dataCache$.pipe(
      map((data) => data?.ideas || []),
      shareReplay(1)
    );
  }

  getFAQs(): Observable<FAQModel[]> {
    return this.dataCache$.pipe(
      map((data) => data?.faqs || []),
      shareReplay(1)
    );
  }

  // Métodos síncronos para mantener compatibilidad (deprecados)
  getServicesSync(): ServiceModel[] {
    return this.dataCache$.value?.services || [];
  }

  getProjectsSync(): ProjectModel[] {
    return this.dataCache$.value?.projects || [];
  }

  getTechnologiesSync(): TechnologyModel[] {
    return this.dataCache$.value?.technologies || [];
  }

  getIdeasSync(): IdeaModel[] {
    return this.dataCache$.value?.ideas || [];
  }

  getFAQsSync(): FAQModel[] {
    return this.dataCache$.value?.faqs || [];
  }

  // Método para recargar datos manualmente
  reloadData(): void {
    this.loadData();
  }

  // Método para verificar si los datos están cargados
  isDataLoaded(): boolean {
    return this.dataCache$.value !== null;
  }

  // Observable para saber cuando los datos están listos
  get dataReady$(): Observable<boolean> {
    return this.dataCache$.pipe(map((data) => data !== null));
  }
}
