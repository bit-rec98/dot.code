import { Injectable } from '@angular/core';
import { ProjectModel } from '../models/project';
import { TechnologyModel } from '../models/technology';
import { IdeaModel } from '../models/idea';
import { FAQModel } from '../models/faq';
import { ServiceModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getServices(): ServiceModel[] {
    return [
      {
        title: 'Desarrollo Web',
        description:
          'Creamos aplicaciones web modernas y escalables utilizando las últimas tecnologías. Desde sitios corporativos hasta plataformas complejas.',
        icon: 'assets/icons/service1.svg',
        bgClass: 'bg-gradient-to-br from-blue-900 to-blue-700',
        features: ['React/Angular', 'Responsive', 'SEO Optimizado'],
      },
      // ... resto de servicios
    ];
  }

  getProjects(): ProjectModel[] {
    return [
      {
        title: 'Portal Educativo Interactivo',
        description:
          'Plataforma de aprendizaje en línea con cursos interactivos, evaluaciones en tiempo real y seguimiento de progreso personalizado.',
        url: 'https://ejemplo-educativo.dot.code',
        technologies: ['Angular', 'Node.js', 'MongoDB'],
      },
      // ... resto de proyectos
    ];
  }

  getTechnologies(): TechnologyModel[] {
    return [
      { name: 'Angular', logo: 'assets/logos/angular.svg' },
      { name: 'React', logo: 'assets/logos/react.svg' },
      // ... resto de tecnologías
    ];
  }

  getIdeas(): IdeaModel[] {
    return [
      {
        title: 'Sistema de IoT para Agricultura',
        description:
          'Monitoreo inteligente de cultivos con sensores de humedad, temperatura y nutrientes para optimizar recursos y mejorar rendimientos.',
        tools: ['Arduino', 'React', 'Node.js', 'MongoDB'],
        bgClass: 'bg-gradient-to-br from-green-900 to-green-700',
      },
      // ... resto de ideas
    ];
  }

  getFAQs(): FAQModel[] {
    return [
      {
        question: '¿Cuánto tiempo toma desarrollar una aplicación web?',
        answer:
          'El tiempo varía según la complejidad, pero típicamente entre 4-12 semanas. Trabajamos con metodologías ágiles para entregarte resultados rápidos y de calidad.',
        category: 'Tiempos',
        bgClass: 'bg-gradient-to-br from-blue-900 to-blue-700',
      },
      // ... resto de FAQs
    ];
  }
}
