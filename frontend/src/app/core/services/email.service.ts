import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { Email } from './models/email';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface EmailAttempts {
  [date: string]: number;
}

interface RateLimitStatus {
  canSend: boolean;
  todayCount: number;
  maxDaily: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly SERVICE_ID = environment.emailjs.serviceId;
  private readonly TEMPLATE_ID = environment.emailjs.templateId;
  private readonly PUBLIC_KEY = environment.emailjs.publicKey;

  // Configuración de rate limiting local
  private readonly DAILY_LIMIT = 3;
  private readonly STORAGE_KEY = 'email_attempts';

  constructor() {
    this.validateConfiguration();
    this.initializeEmailJS();
  }

  private validateConfiguration(): void {
    if (!this.SERVICE_ID || !this.TEMPLATE_ID || !this.PUBLIC_KEY) {
      throw new Error('EmailJS configuration is incomplete.');
    }
  }

  private initializeEmailJS(): void {
    emailjs.init({
      publicKey: this.PUBLIC_KEY,
      blockHeadless: true,
      blockList: {
        list: [],
        watchVariable: 'from_email',
      },
      limitRate: {
        id: 'dot-code-contact-form',
        throttle: 60000,
      },
    });
  }

  /**
   * Envía un email con rate limiting híbrido
   */
  public sendEmail(
    emailData: Email
  ): Observable<{ success: boolean; message: string }> {
    const rateLimitCheck = this.checkLocalRateLimit();
    if (!rateLimitCheck.canSend) {
      return throwError(() => ({
        success: false,
        message: rateLimitCheck.message || 'Rate limit exceeded',
        rateLimited: true,
      }));
    }

    const templateParams = {
      from_name: emailData.name,
      from_email: emailData.email,
      subject: emailData.subject,
      message: emailData.message,
      to_name: 'Equipo dot.code',
      // Metadata adicional
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };

    return new Observable((observer) => {
      emailjs
        .send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams)
        .then((response: EmailJSResponseStatus) => {
          this.recordSuccessfulSend();
          observer.next({
            success: true,
            message: 'Email enviado exitosamente',
          });
          observer.complete();
        })
        .catch((error) => {
          const errorResponse = this.handleEmailError(error);
          observer.error(errorResponse);
        });
    });
  }

  /**
   * Verifica el rate limit local antes de enviar
   */
  private checkLocalRateLimit(): RateLimitStatus {
    const today = new Date().toDateString();
    const attempts = this.getStoredAttempts();
    const todayCount = attempts[today] || 0;

    if (todayCount >= this.DAILY_LIMIT) {
      return {
        canSend: false,
        todayCount,
        maxDaily: this.DAILY_LIMIT,
        message: `Has alcanzado el límite diario de ${this.DAILY_LIMIT} emails. Intenta mañana.`,
      };
    }

    return {
      canSend: true,
      todayCount,
      maxDaily: this.DAILY_LIMIT,
    };
  }

  /**
   * Maneja los diferentes tipos de errores de EmailJS
   */
  private handleEmailError(error: any): any {
    let errorMessage =
      'Error al enviar el email. Por favor intenta nuevamente.';
    let rateLimited = false;

    // Error 429: Rate limiting de EmailJS
    if (error.status === 429) {
      errorMessage =
        'Demasiados intentos. Espera 30 segundos e intenta nuevamente.';
      rateLimited = true;
    }
    // Error de conexión/red
    else if (error.name === 'NetworkError' || error.status === 0) {
      errorMessage =
        'Error de conexión. Verifica tu internet e intenta nuevamente.';
    }
    // Email bloqueado
    else if (error.text?.includes('Blocked') || error.status === 403) {
      errorMessage = 'Tu email ha sido bloqueado temporalmente por seguridad.';
      rateLimited = true;
    }
    // Datos inválidos
    else if (error.text?.includes('Invalid') || error.status === 400) {
      errorMessage = 'Los datos del formulario contienen información inválida.';
    }
    // Error del servidor
    else if (error.status >= 500) {
      errorMessage = 'Error del servidor. Intenta nuevamente en unos minutos.';
    }
    // Error de autenticación
    else if (error.status === 401) {
      errorMessage = 'Error de configuración del servicio de email.';
    }

    return {
      success: false,
      message: errorMessage,
      rateLimited,
      error,
    };
  }

  /**
   * Registra un envío exitoso
   */
  private recordSuccessfulSend(): void {
    const today = new Date().toDateString();
    const attempts = this.getStoredAttempts();

    attempts[today] = (attempts[today] || 0) + 1;
    this.cleanOldAttempts(attempts);
    this.saveAttempts(attempts);
  }

  /**
   * Obtiene los intentos almacenados
   */
  private getStoredAttempts(): EmailAttempts {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Guarda los intentos en localStorage
   */
  private saveAttempts(attempts: EmailAttempts): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.warn('Error al guardar attempts en localStorage:', error);
    }
  }

  /**
   * Limpia intentos antiguos (mantener solo últimos 7 días)
   */
  private cleanOldAttempts(attempts: EmailAttempts): void {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    Object.keys(attempts).forEach((date) => {
      if (new Date(date) < sevenDaysAgo) {
        delete attempts[date];
      }
    });
  }

  /**
   * Obtiene estadísticas de envío de emails
   */
  public getEmailStats(): {
    todayCount: number;
    maxDaily: number;
    remainingToday: number;
  } {
    const today = new Date().toDateString();
    const attempts = this.getStoredAttempts();
    const todayCount = attempts[today] || 0;

    return {
      todayCount,
      maxDaily: this.DAILY_LIMIT,
      remainingToday: Math.max(0, this.DAILY_LIMIT - todayCount),
    };
  }

  /**
   * Verifica si se puede enviar un email (para uso en componentes)
   */
  public canSendEmail(): boolean {
    return this.checkLocalRateLimit().canSend;
  }

  /**
   * Obtiene el estado completo del rate limiting
   */
  public getRateLimitStatus(): RateLimitStatus {
    return this.checkLocalRateLimit();
  }

  /**
   * Limpia el historial de rate limiting (solo para desarrollo/testing)
   */
  public clearRateLimit(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
