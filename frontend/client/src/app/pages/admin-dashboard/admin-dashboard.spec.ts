import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

  totalUsers = 0;

  totalColours = 6;

  totalDesigns = 0;


  constructor(private router: Router) {}


  ngOnInit(): void {

    this.loadStatistics();

  }


  loadStatistics(): void {

    // Temporary user count.
    // We will connect this to MongoDB later.

    this.totalUsers = 1;


    // Count saved designs
    // from localStorage.

    const designs =
      localStorage.getItem('savedDesigns');


    if (designs) {

      try {

        const parsedDesigns =
          JSON.parse(designs);

        this.totalDesigns =
          parsedDesigns.length;

      } catch {

        this.totalDesigns = 0;

      }

    } else {

      this.totalDesigns = 0;

    }

  }


  manageUsers(): void {

    alert(
      'User Management will be added next.'
    );

  }


  manageColours(): void {

    alert(
      'Paint Colour Management will be added next.'
    );

  }


  manageDesigns(): void {

    this.router.navigate([
      '/saved-projects'
    ]);

  }


  addColour(): void {

    alert(
      'Add Colour feature will be added next.'
    );

  }


  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);

  }

}