import { Injectable } from '@angular/core';
import { IdeaModel } from '../models/idea';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {

  // Ideas innovadoras
  allIdeas: IdeaModel[] = [];
  displayedIdeas: IdeaModel[] = [];
  private remainingQueue: IdeaModel[] = [];

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
    this.displayedIdeas = this.allIdeas.slice(0, 6);
    const remaining = this.allIdeas.slice(6);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    this.remainingQueue = remaining;
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
    if (this.remainingQueue.length === 0) return;
    this.isIdeaChanging = true;
    this.currentChangingIndex = Math.floor(Math.random() * 6);

    setTimeout(() => {
      const incoming = this.remainingQueue.shift()!;
      const outgoing = this.displayedIdeas[this.currentChangingIndex];
      this.remainingQueue.push(outgoing);
      this.displayedIdeas = [
        ...this.displayedIdeas.slice(0, this.currentChangingIndex),
        incoming,
        ...this.displayedIdeas.slice(this.currentChangingIndex + 1),
      ];
      this.isIdeaChanging = false;
    }, 500);
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
