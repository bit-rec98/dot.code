import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceModel } from '../../core/models';
import { CommonModule, NgFor } from '@angular/common';
import { ServiceCardComponent } from '../../components';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TestimonialModel } from '../../core/models/testimonial';
import { TechnologyModel } from '../../core/models/technology';
import { IdeaModel } from '../../core/models/idea';
import { ProjectModel } from '../../core/models/project';
import { ContactComponent } from '../../components/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ServiceCardComponent,
    CommonModule,
    NgFor,
    ReactiveFormsModule,
    RouterLink,
    ContactComponent
  ],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  services: ServiceModel[] = [
    {
      title: 'Desarrollo',
      description: 'Description for Web Development',
      icon: 'assets/icons/service1.svg',
    },
    {
      title: 'Diseño de Aplicaciones',
      description: 'Description for App Development',
      icon: 'assets/icons/service2.svg',
    },
    {
      title: 'Desarrollo de Software a Medida',
      description: 'Description for Custom Software Development',
      icon: 'assets/icons/service3.svg',
    },
    {
      title: 'Consultoría IT',
      description: 'Description for IT Consulting',
      icon: 'assets/icons/service1.svg',
    },
    {
      title: 'Mantenimiento',
      description: 'Description for Maintenance',
      icon: 'assets/icons/service2.svg',
    },
    {
      title: 'Soporte Técnico',
      description: 'Description for Soporte Técnico',
      icon: 'assets/icons/service3.svg',
    },
  ];

  testimonials: TestimonialModel[] = [
    {
      name: 'Carlos Méndez',
      company: 'TechSolutions SpA',
      quote:
        'El equipo de dot.dev transformó nuestra idea en una aplicación web excepcional. Su atención al detalle y soporte continuo han sido invaluables para nuestro negocio.',
      image: 'assets/images/testimonials/person1.jpg',
    },
    {
      name: 'María Fernández',
      company: 'InnovateMKT',
      quote:
        'Trabajar con dot.dev ha sido una experiencia extraordinaria. Entendieron perfectamente nuestras necesidades y entregaron un producto que superó nuestras expectativas.',
      image: 'assets/images/testimonials/person2.jpg',
    },
    {
      name: 'Roberto Álvarez',
      company: 'GrupoFinanzas',
      quote:
        'La plataforma que desarrollaron para nosotros ha mejorado significativamente nuestra eficiencia operativa. El mantenimiento constante garantiza que siempre funcione perfectamente.',
      image: 'assets/images/testimonials/person3.jpg',
    },
    {
      name: 'Laura Sánchez',
      company: 'EduTech',
      quote:
        'Como startup, necesitábamos un socio técnico confiable. dot.dev no solo construyó nuestra plataforma, sino que nos ha guiado en cada paso del camino tecnológico.',
      image: 'assets/images/testimonials/person4.jpg',
    },
  ];

  currentTestimonialIndex = 0;
  testimonialInterval: any;

  technologies: TechnologyModel[] = [
    {
      name: 'Angular',
      logo: 'assets/logos/angular.svg',
    },
    {
      name: 'React',
      logo: 'assets/logos/react.svg',
    },
    {
      name: 'Node.js',
      logo: 'assets/logos/nodejs.svg',
    },
    {
      name: 'TypeScript',
      logo: 'assets/logos/typescript.svg',
    },
    {
      name: 'MongoDB',
      logo: 'assets/logos/mongodb.svg',
    },
    {
      name: 'AWS',
      logo: 'assets/logos/aws.svg',
    },
    {
      name: 'Docker',
      logo: 'assets/logos/docker.svg',
    },
    {
      name: 'PostgreSQL',
      logo: 'assets/logos/postgresql.svg',
    },
  ];

  currentTechIndex = 0;
  techInterval: any;
  techItemsPerView = 4;

  // Ideas innovadoras
  allIdeas: IdeaModel[] = [
    {
      title: 'Sistema de IoT para Agricultura',
      description:
        'Monitoreo inteligente de cultivos con sensores de humedad, temperatura y nutrientes para optimizar recursos y mejorar rendimientos.',
      tools: ['Arduino', 'React', 'Node.js', 'MongoDB'],
      bgClass: 'bg-gradient-to-br from-green-900 to-green-700',
    },
    {
      title: 'Plataforma de eLearning Inmersiva',
      description:
        'Experiencia de aprendizaje con realidad aumentada e inteligencia artificial para personalizar contenidos según el estilo de aprendizaje.',
      tools: ['React', 'Three.js', 'WebXR', 'Python'],
      bgClass: 'bg-gradient-to-br from-blue-900 to-blue-700',
    },
    {
      title: 'Marketplace para Artesanos Locales',
      description:
        'Conectamos artesanos con consumidores globales utilizando blockchain para certificar autenticidad y trazabilidad de productos artesanales.',
      tools: ['Angular', 'Ethereum', 'Node.js', 'AWS'],
      bgClass: 'bg-gradient-to-br from-amber-900 to-amber-700',
    },
    {
      title: 'Asistente Virtual para Salud Mental',
      description:
        'Aplicación de seguimiento del bienestar con chatbot de apoyo emocional utilizando procesamiento de lenguaje natural y machine learning.',
      tools: ['TensorFlow', 'React Native', 'Firebase', 'NLP'],
      bgClass: 'bg-gradient-to-br from-purple-900 to-purple-700',
    },
    {
      title: 'Gestión Inteligente de Residuos',
      description:
        'Sistema para optimizar la recolección de residuos urbanos con contenedores inteligentes que notifican niveles y optimizan rutas.',
      tools: ['IoT', 'Google Maps API', 'MongoDB', 'Flutter'],
      bgClass: 'bg-gradient-to-br from-teal-900 to-teal-700',
    },
    {
      title: 'Plataforma de Turismo Sostenible',
      description:
        'Conectamos viajeros con experiencias turísticas de bajo impacto ambiental y alto valor para comunidades locales.',
      tools: ['Vue.js', 'Node.js', 'PostgreSQL', 'AWS'],
      bgClass: 'bg-gradient-to-br from-cyan-900 to-cyan-700',
    },
    {
      title: 'Sistema de Gestión Energética',
      description:
        'Monitoreo y optimización del consumo energético en edificios comerciales utilizando IA para predecir patrones y sugerir ahorros.',
      tools: ['Python', 'TensorFlow', 'Angular', 'InfluxDB'],
      bgClass: 'bg-gradient-to-br from-orange-900 to-orange-700',
    },
    {
      title: 'Movilidad Urbana Compartida',
      description:
        'Plataforma para compartir trayectos y medios de transporte alternativos con gamificación para incentivar la movilidad sostenible.',
      tools: ['React Native', 'Firebase', 'Google Maps', 'Gamification'],
      bgClass: 'bg-gradient-to-br from-indigo-900 to-indigo-700',
    },
    {
      title: 'Trazabilidad Alimentaria Blockchain',
      description:
        'Seguimiento del origen a la mesa para productos alimentarios con certificación de calidad y sostenibilidad mediante blockchain.',
      tools: ['Hyperledger', 'React', 'Node.js', 'QR Codes'],
      bgClass: 'bg-gradient-to-br from-lime-900 to-lime-700',
    },
    {
      title: 'Telemedicina para Zonas Rurales',
      description:
        'Solución para llevar atención médica especializada a comunidades remotas con diagnóstico asistido por IA y consultas por video.',
      tools: ['WebRTC', 'TensorFlow', 'React', 'MongoDB'],
      bgClass: 'bg-gradient-to-br from-red-900 to-red-700',
    },
    {
      title: 'Finanzas Personales con IA',
      description:
        'Aplicación que analiza hábitos financieros y ofrece recomendaciones personalizadas para mejorar la salud financiera.',
      tools: ['Python', 'Machine Learning', 'Vue.js', 'PostgreSQL'],
      bgClass: 'bg-gradient-to-br from-emerald-900 to-emerald-700',
    },
    {
      title: 'Plataforma de Voluntariado Digital',
      description:
        'Conectamos profesionales tecnológicos con ONGs para realizar proyectos de impacto social a través del voluntariado de habilidades.',
      tools: ['Angular', 'Firebase', 'GitHub API', 'Material Design'],
      bgClass: 'bg-gradient-to-br from-pink-900 to-pink-700',
    },
  ];

  /**
   * ========================================
   * Bloque de sección para ideas de proyectos
   * ========================================
   */
  // Ideas que se muestran actualmente en la grilla
  displayedIdeas: IdeaModel[] = [];

  // Control de transiciones
  ideasInterval: any;
  currentChangingIndex = 0;
  isIdeaChanging = false;

  // Datos de proyectos
  projects: ProjectModel[] = [
    {
      title: 'Portal Educativo Interactivo',
      description:
        'Plataforma de aprendizaje en línea con cursos interactivos, evaluaciones en tiempo real y seguimiento de progreso personalizado.',
      // screenshot: 'assets/images/projects/project1.jpg',
      url: 'https://ejemplo-educativo.dot.code',
      technologies: ['Angular', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Sistema de Gestión Empresarial',
      description:
        'Software integrado para administración de recursos, inventario, clientes y finanzas con reportes personalizados y dashboard analítico.',
      // screenshot: 'assets/images/projects/project2.jpg',
      url: 'https://ejemplo-empresarial.dot.code',
      technologies: ['React', 'Express', 'PostgreSQL'],
    },
    {
      title: 'Marketplace de Servicios Locales',
      description:
        'Plataforma que conecta profesionales independientes con clientes potenciales mediante un sistema de reputación y pagos integrados.',
      // screenshot: 'assets/images/projects/project3.jpg',
      url: 'https://ejemplo-marketplace.dot.code',
      technologies: ['Vue.js', 'Firebase', 'Stripe API'],
    },
    {
      title: 'App de Bienestar y Salud',
      description:
        'Aplicación móvil para seguimiento de hábitos saludables, rutinas de ejercicio y meditación con asesoramiento personalizado.',
      // screenshot: 'assets/images/projects/project4.jpg',
      url: 'https://ejemplo-bienestar.dot.code',
      technologies: ['React Native', 'GraphQL', 'AWS'],
    },
    {
      title: 'Plataforma de Comercio Electrónico',
      description:
        'Tienda online completa con catálogo de productos, carrito de compras, pasarela de pagos y sistema de gestión de inventario.',
      // screenshot: 'assets/images/projects/project5.jpg',
      url: 'https://ejemplo-ecommerce.dot.code',
      technologies: ['Angular', 'Django', 'MySQL'],
    },
    {
      title: 'Sistema de Reservas Turísticas',
      description:
        'Plataforma para gestionar reservas de alojamientos, tours y experiencias turísticas con integración de mapas y recomendaciones.',
      // screenshot: 'assets/images/projects/project6.jpg',
      url: 'https://ejemplo-turismo.dot.code',
      technologies: ['Next.js', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Sistema de Reservas Turísticas',
      description:
        'Plataforma para gestionar reservas de alojamientos, tours y experiencias turísticas con integración de mapas y recomendaciones.',
      // screenshot: 'assets/images/projects/project6.jpg',
      url: 'https://ejemplo-turismo.dot.code',
      technologies: ['Next.js', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Sistema de Reservas Turísticas',
      description:
        'Plataforma para gestionar reservas de alojamientos, tours y experiencias turísticas con integración de mapas y recomendaciones.',
      // screenshot: 'assets/images/projects/project6.jpg',
      url: 'https://ejemplo-turismo.dot.code',
      technologies: ['Next.js', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Sistema de Reservas Turísticas',
      description:
        'Plataforma para gestionar reservas de alojamientos, tours y experiencias turísticas con integración de mapas y recomendaciones.',
      // screenshot: 'assets/images/projects/project6.jpg',
      url: 'https://ejemplo-turismo.dot.code',
      technologies: ['Next.js', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Sistema de Reservas Turísticas',
      description:
        'Plataforma para gestionar reservas de alojamientos, tours y experiencias turísticas con integración de mapas y recomendaciones.',
      // screenshot: 'assets/images/projects/project6.jpg',
      url: 'https://ejemplo-turismo.dot.code',
      technologies: ['Next.js', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Sistema de Reservas Turísticas',
      description:
        'Plataforma para gestionar reservas de alojamientos, tours y experiencias turísticas con integración de mapas y recomendaciones.',
      // screenshot: 'assets/images/projects/project6.jpg',
      url: 'https://ejemplo-turismo.dot.code',
      technologies: ['Next.js', 'Node.js', 'MongoDB'],
    },
  ];

  // Control del carrusel de proyectos
  currentProjectIndex = 0;
  projectsPerView = 3;
  projectsInterval: any;

  /**
   * Formulario de contacto
   * @type {FormGroup}
   */
  contactForm: FormGroup;

  /**
   * Constructor de la clase HomeComponent
   * @param fb
   */
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rubro: ['', [Validators.required]],
      objetivo: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  /**
   * Método que se ejecuta al inicializar el componente
   * - Inicia los carruseles de testimonios y tecnologías
   * - Ajusta el número de elementos por vista según el tamaño de pantalla
   * - Inicializa las ideas mostradas
   */
  ngOnInit(): void {
    // Iniciar carruseles
    this.startTestimonialCarousel();
    this.startTechCarousel();

    // Ajustar items por vista según tamaño de pantalla
    this.adjustTechItemsPerView();
    window.addEventListener('resize', this.adjustTechItemsPerView.bind(this));

    // Inicializar ideas mostradas
    this.initializeIdeas();

    // Iniciar ciclo de cambio de ideas
    this.startIdeasCycle();

    // Iniciar carrusel de proyectos
    this.startProjectsCarousel();
  }

  /**
   * Método que se ejecuta al destruir el componente
   * - Limpia los intervalos de los carruseles y el ciclo de ideas
   * - Elimina el evento de ajuste de tamaño de pantalla
   * - Detiene el carrusel de proyectos
   */
  ngOnDestroy(): void {
    // Limpiar intervalos
    this.stopTestimonialCarousel();
    this.stopTechCarousel();
    window.removeEventListener(
      'resize',
      this.adjustTechItemsPerView.bind(this)
    );

    // Detener ciclo de ideas
    this.stopIdeasCycle();

    // Detener carrusel de proyectos
    this.stopProjectsCarousel();
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de testimonios
   * ========================================
   */
  startTestimonialCarousel(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000); // Cambiar cada 5 segundos
  }

  stopTestimonialCarousel(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  nextTestimonial(): void {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  setTestimonial(index: number): void {
    this.currentTestimonialIndex = index;
  }

  // Ajustar items por vista según tamaño de ventana
  adjustTechItemsPerView(): void {
    if (window.innerWidth < 640) {
      // móvil
      this.techItemsPerView = 1;
    } else if (window.innerWidth < 1024) {
      // tablet
      this.techItemsPerView = 2;
    } else {
      // desktop
      this.techItemsPerView = 4;
    }
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de tecnologías
   * ========================================
   */
  startTechCarousel(): void {
    this.techInterval = setInterval(() => {
      this.nextTech();
    }, 3000); // Cambiar cada 3 segundos
  }

  stopTechCarousel(): void {
    if (this.techInterval) {
      clearInterval(this.techInterval);
    }
  }

  nextTech(): void {
    this.currentTechIndex =
      (this.currentTechIndex + 1) %
      (this.technologies.length - this.techItemsPerView + 1);
  }

  prevTech(): void {
    this.currentTechIndex =
      (this.currentTechIndex -
        1 +
        this.technologies.length -
        this.techItemsPerView +
        1) %
      (this.technologies.length - this.techItemsPerView + 1);
  }

  setTech(index: number): void {
    this.currentTechIndex = index;
  }

  // Comprobar si un índice es visible en la vista actual
  isTechVisible(index: number): boolean {
    return (
      index >= this.currentTechIndex &&
      index < this.currentTechIndex + this.techItemsPerView
    );
  }

  /**
   * ========================================
   * Sección de métodos para ideas de proyectos
   * ========================================
   */
  initializeIdeas(): void {
    // Seleccionar las primeras 6 ideas para mostrar (3x2 grid)
    this.displayedIdeas = this.allIdeas.slice(0, 6);

    // Barajar las ideas restantes
    this.shuffleRemainingIdeas();
  }

  // Barajar ideas para asegurar variedad
  shuffleRemainingIdeas(): void {
    const displayedIds = new Set(this.displayedIdeas.map((idea) => idea.title));
    const remainingIdeas = this.allIdeas.filter(
      (idea) => !displayedIds.has(idea.title)
    );

    // Fisher-Yates shuffle algorithm
    for (let i = remainingIdeas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingIdeas[i], remainingIdeas[j]] = [
        remainingIdeas[j],
        remainingIdeas[i],
      ];
    }

    // Guardar las ideas barajadas
    this.allIdeas = [...this.displayedIdeas, ...remainingIdeas];
  }

  // Iniciar ciclo de cambio de ideas
  startIdeasCycle(): void {
    this.ideasInterval = setInterval(() => {
      this.changeRandomIdea();
    }, 15000); // Cambiar cada 15 segundos
  }

  // Detener ciclo de cambio de ideas
  stopIdeasCycle(): void {
    if (this.ideasInterval) {
      clearInterval(this.ideasInterval);
    }
  }

  // Cambiar una idea aleatoria con una nueva
  changeRandomIdea(): void {
    // Marcar que está cambiando para la animación
    this.isIdeaChanging = true;

    // Seleccionar un índice aleatorio para cambiar
    this.currentChangingIndex = Math.floor(Math.random() * 6);

    // Después de un tiempo para la animación de salida
    setTimeout(() => {
      // Obtener la siguiente idea disponible
      const nextIdea = this.allIdeas[6]; // La primera idea que no se está mostrando

      // Rotar el array de todas las ideas
      this.allIdeas.push(this.allIdeas.shift()!);

      // Actualizar la idea en la posición actual
      this.displayedIdeas[this.currentChangingIndex] = nextIdea;

      // Reactivar la animación de entrada
      this.isIdeaChanging = false;
    }, 500); // Medio segundo para la transición
  }

  /**
   * ========================================
   * Sección de métodos para el carrusel de proyectos
   * ========================================
   */
  startProjectsCarousel(): void {
    this.projectsInterval = setInterval(() => {
      this.nextProjects();
    }, 8000); // Cambiar cada 8 segundos
  }

  stopProjectsCarousel(): void {
    if (this.projectsInterval) {
      clearInterval(this.projectsInterval);
    }
  }

  nextProjects(): void {
    const maxIndex = Math.ceil(this.projects.length / this.projectsPerView) - 1;
    this.currentProjectIndex = (this.currentProjectIndex + 1) % (maxIndex + 1);
  }

  prevProjects(): void {
    const maxIndex = Math.ceil(this.projects.length / this.projectsPerView) - 1;
    this.currentProjectIndex =
      (this.currentProjectIndex - 1 + maxIndex + 1) % (maxIndex + 1);
  }

  // Obtener el número total de páginas para el carrusel de proyectos
  get totalProjectPages(): number {
    return Math.ceil(this.projects.length / this.projectsPerView);
  }

  // Abrir proyecto en nueva pestaña
  openProjectUrl(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Método para enviar el formulario de contacto
   * - Valida el formulario y si es válido, envía los datos
   * - Resetea el formulario después de enviar
   */
  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Here you would send the form data to your backend
      this.contactForm.reset();
    }
  }
}
