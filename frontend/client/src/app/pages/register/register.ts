import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  name = '';
  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  register() {

    if (!this.name || !this.email || !this.password) {
      alert('Please fill all fields');
      return;
    }

    this.auth.register(
      this.name,
      this.email,
      this.password
    ).subscribe({

      next: (response) => {

        console.log('Registration Response:', response);

        alert('Registration Successful!');

        // Go to login page
        this.router.navigate(['/login']);
      },

      error: (error) => {

        console.error('Registration Error:', error);

        alert(
          error.error?.message ||
          'Registration failed. Please try again.'
        );
      }

    });
  }
}