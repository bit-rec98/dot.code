import { Injectable } from '@angular/core';
import { IdeaModel } from '../models/idea';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {

  // Ideas innovadoras
  allIdeas: IdeaModel[] = [];
  displayedIdeas: IdeaModel[] = [];

  // Control de transiciones
  ideasInterval: any;
  currentChangingIndex = 0;
  isIdeaChanging = false;

  constructor() { }

  /**
   * Inicializar ideas con los datos cargados
   */
  initializeIdeas(ideas: IdeaModel[]): void {
    this.allIdeas = [...ideas];
    // Seleccionar las primeras 6 ideas para mostrar (3x2 grid)
    this.displayedIdeas = this.allIdeas.slice(0, 6);

    // Barajar las ideas restantes
    this.shuffleRemainingIdeas();
  }

  /**
   * Barajar ideas para asegurar variedad
   */
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

  /**
   * Iniciar ciclo de cambio de ideas
   */
  startIdeasCycle(): void {
    this.ideasInterval = setInterval(() => {
      this.changeRandomIdea();
    }, 15000); // Cambiar cada 15 segundos
  }

  /**
   * Detener ciclo de cambio de ideas
   */
  stopIdeasCycle(): void {
    if (this.ideasInterval) {
      clearInterval(this.ideasInterval);
    }
  }

  /**
   * Cambiar una idea aleatoria con una nueva
   */
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
   * Obtener las ideas actualmente mostradas
   */
  getDisplayedIdeas(): IdeaModel[] {
    return this.displayedIdeas;
  }

  /**
   * Verificar si una idea está cambiando
   */
  getIsIdeaChanging(): boolean {
    return this.isIdeaChanging;
  }

  /**
   * Obtener el índice actual de cambio
   */
  getCurrentChangingIndex(): number {
    return this.currentChangingIndex;
  }
}
