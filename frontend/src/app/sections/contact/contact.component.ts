import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmailService } from '../../core/services/email.service';
import { Email } from '../../core/services/models/email';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  formSubmitted = false;
  isLoading = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {}

  // Getters para acceso fácil a los form fields
  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get subject() {
    return this.contactForm.get('subject');
  }
  get message() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    // Verificar si puede enviar antes de proceder
    if (!this.emailService.canSendEmail()) {
      const stats = this.emailService.getEmailStats();
      this.showMessage(
        `Has alcanzado el límite diario de ${stats.maxDaily} emails. Intenta mañana.`,
        'error'
      );
      return;
    }

    this.isLoading = true;
    this.submitMessage = '';

    const emailData: Email = this.contactForm.value;

    this.emailService.sendEmail(emailData).subscribe({
      next: (response) => {
        this.handleSuccessResponse();
      },
      error: (error) => {
        this.handleErrorResponse(error);
      },
    });
  }

  /**
   * Maneja la respuesta exitosa
   */
  private handleSuccessResponse(): void {
    this.formSubmitted = true;
    this.isLoading = false;
    this.showMessage(
      '¡Mensaje enviado exitosamente! Te contactaremos pronto.',
      'success'
    );

    // Auto reset después de 5 segundos
    setTimeout(() => {
      this.resetForm();
    }, 5000);
  }

  /**
   * Maneja errores en el envío
   */
  private handleErrorResponse(error: any): void {
    this.isLoading = false;

    if (error.rateLimited) {
      this.showMessage(error.message, 'error');
    } else {
      this.showMessage(
        error.message ||
          'Error al enviar el mensaje. Por favor intenta nuevamente.',
        'error'
      );
    }

    console.error('Error sending email:', error);
  }

  /**
   * Marca todos los campos como touched para mostrar validaciones
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Muestra un mensaje temporal al usuario
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.submitMessage = message;
    this.submitMessageType = type;

    // Auto hide después de 8 segundos
    setTimeout(() => {
      this.submitMessage = '';
    }, 8000);
  }

  /**
   * Resetea el formulario completamente
   */
  private resetForm(): void {
    this.contactForm.reset();
    this.formSubmitted = false;
    this.submitMessage = '';

    // Reset validation states
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }

  /**
   * Obtiene las estadísticas de envío para mostrar al usuario
   */
  getEmailStats() {
    return this.emailService.getEmailStats();
  }

  /**
   * Verifica si el usuario puede enviar emails
   */
  canSendEmail(): boolean {
    return this.emailService.canSendEmail();
  }

  /**
   * Obtiene información detallada del rate limiting
   */
  getRateLimitInfo() {
    return this.emailService.getRateLimitStatus();
  }
}
