import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { EmailService } from '../../core/services/email.service';
import { Email } from '../../core/services/models/email';

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  return value.trim().length === 0 ? { whitespace: true } : null;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  formSubmitted = false;
  isLoading = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' = 'success';
  showDirectContact = false;
  cooldownSeconds = 0;

  private cooldownInterval?: ReturnType<typeof setInterval>;
  private messageTimeout?: ReturnType<typeof setTimeout>;
  private resetTimeout?: ReturnType<typeof setTimeout>;

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000), noWhitespaceValidator]],
      // Honeypot: bots fill this, humans don't see it
      _hp: [''],
    });
  }

  ngOnInit(): void {
    this.startCooldownTimer();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

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

  get isSubmitDisabled(): boolean {
    return this.isLoading || this.formSubmitted || this.cooldownSeconds > 0;
  }

  private startCooldownTimer(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
    const remaining = this.emailService.getCooldownRemaining();
    if (remaining <= 0) return;

    this.cooldownSeconds = Math.ceil(remaining / 1000);
    this.cooldownInterval = setInterval(() => {
      this.cooldownSeconds = Math.max(0, this.cooldownSeconds - 1);
      if (this.cooldownSeconds === 0) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    // Honeypot check: silently fake success to avoid revealing bot detection
    if (this.contactForm.get('_hp')?.value) {
      this.handleSuccessResponse();
      return;
    }

    const rateLimitStatus = this.emailService.getRateLimitStatus();
    if (!rateLimitStatus.canSend) {
      this.showMessage(rateLimitStatus.message || 'Rate limit exceeded', 'error');
      if (rateLimitStatus.cooldownRemaining > 0) {
        this.startCooldownTimer();
      }
      return;
    }

    this.isLoading = true;
    this.submitMessage = '';

    const emailData: Email = {
      name: this.name!.value.trim(),
      email: this.email!.value.trim().toLowerCase(),
      subject: this.subject!.value,
      message: this.message!.value.trim(),
    };

    this.emailService.sendEmail(emailData).subscribe({
      next: () => {
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
    this.startCooldownTimer();

    // Auto reset después de 5 segundos
    this.resetTimeout = setTimeout(() => {
      this.resetForm();
    }, 5000);
  }

  /**
   * Maneja errores en el envío
   */
  private handleErrorResponse(error: any): void {
    this.isLoading = false;
    this.showDirectContact = !!error.showFallback;
    this.showMessage(
      error.message || 'No se pudo enviar el mensaje. Contactanos directamente.',
      'error'
    );
    if (error.rateLimited && this.emailService.getCooldownRemaining() > 0) {
      this.startCooldownTimer();
    }
  }

  /**
   * Marca todos los campos como touched para mostrar validaciones
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.contactForm.controls).forEach((key) => {
      if (key !== '_hp') {
        this.contactForm.get(key)?.markAsTouched();
      }
    });
  }

  /**
   * Muestra un mensaje temporal al usuario
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.submitMessage = message;
    this.submitMessageType = type;

    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    // Auto hide después de 8 segundos
    this.messageTimeout = setTimeout(() => {
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
    this.showDirectContact = false;

    // Reset validation states
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }

  private clearTimers(): void {
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
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
