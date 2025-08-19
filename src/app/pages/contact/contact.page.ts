import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.css']
})
export class ContactPage {
  model = { name: '', email: '', message: '' };
  submitting = signal(false);
  success = signal(false);
  error = signal(false);

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async onSubmit() {
    this.submitting.set(true);
    this.success.set(false);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.success.set(true);
      this.model = { name: '', email: '', message: '' }; // Clear form
    } catch (e) {
      this.error.set(true);
    } finally {
      this.submitting.set(false);
    }
  }
}


