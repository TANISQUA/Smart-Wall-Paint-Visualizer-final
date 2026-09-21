import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  login() {

    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {

        console.log('Login Response:', response);

        // Save JWT token
        localStorage.setItem('token', response.token);

        // Save user information
        localStorage.setItem('user', JSON.stringify(response.user));

        alert('Login Successful!');

        // Go to dashboard
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        console.error('Login Error:', error);

        alert(
          error.error?.message ||
          'Login failed. Please check your email and password.'
        );
      }
    });
  }
}