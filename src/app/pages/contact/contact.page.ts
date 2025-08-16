import { Component } from '@angular/core';
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
  onSubmit() {
    // Placeholder: wire to email or backend later
    alert('Thanks for reaching out, I will get back to you.');
    this.model = { name: '', email: '', message: '' };
  }
}


