import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})


export class AdminDashboard implements OnInit {

  totalUsers: number = 0;

  totalColours: number = 0;

  totalDesigns: number = 0;


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    console.log('================================');
    console.log('ADMIN DASHBOARD LOADED');
    console.log('================================');

    this.loadDesignCount();

    this.loadColourCount();

    this.loadUserCount();

  }


  // ============================================================
  // SAVED DESIGNS
  // ============================================================

  async loadDesignCount(): Promise<void> {

    console.log('Loading saved designs...');

    try {

      const response = await fetch(
        '${environment.apiUrl}/designs/count'
      );

      console.log(
        'Design response status:',
        response.status
      );


      if (!response.ok) {

        throw new Error(
          'Design API error: ' + response.status
        );

      }


      const data = await response.json();


      console.log(
        'Design data received:',
        data
      );


      this.totalDesigns = Number(data.count);


      console.log(
        'TOTAL DESIGNS =',
        this.totalDesigns
      );


      // Force Angular to update the HTML
      this.cdr.detectChanges();


    } catch (error) {

      console.error(
        'Could not load designs:',
        error
      );

      this.totalDesigns = 0;

      this.cdr.detectChanges();

    }

  }


  // ============================================================
  // PAINT COLOURS
  // ============================================================

  async loadColourCount(): Promise<void> {

    try {

      const response = await fetch(
        '${environment.apiUrl}/colours'
      );


      if (!response.ok) {

        throw new Error(
          'Colour API error: ' + response.status
        );

      }


      const data = await response.json();


      console.log(
        'Colours received:',
        data
      );


      if (Array.isArray(data)) {

        this.totalColours = data.length;

      } else {

        this.totalColours = 0;

      }


      this.cdr.detectChanges();


    } catch (error) {

      console.error(
        'Could not load colours:',
        error
      );

      this.totalColours = 0;

      this.cdr.detectChanges();

    }

  }


  // ============================================================
  // USERS
  // ============================================================

  async loadUserCount(): Promise<void> {

    try {

      const response = await fetch(
        '${environment.apiUrl}/auth/users'
      );


      if (!response.ok) {

        console.log(
          'Users API is not available.'
        );

        this.totalUsers = 0;

        return;

      }


      const data = await response.json();


      console.log(
        'Users received:',
        data
      );


      if (Array.isArray(data)) {

        this.totalUsers = data.length;

      } else {

        this.totalUsers = 0;

      }


      this.cdr.detectChanges();


    } catch (error) {

      console.log(
        'Users API is not available.'
      );

      this.totalUsers = 0;

    }

  }


  // ============================================================
  // MANAGE USERS
  // ============================================================

  manageUsers(): void {

    console.log(
      'User Management clicked'
    );

  }


  // ============================================================
  // MANAGE COLOURS
  // ============================================================

  manageColours(): void {

    this.router.navigate([
      '/colour-management'
    ]);

  }


  // ============================================================
  // MANAGE DESIGNS
  // ============================================================

  manageDesigns(): void {

    this.router.navigate([
      '/saved-projects'
    ]);

  }


  // ============================================================
  // ADD COLOUR
  // ============================================================

  addColour(): void {

    this.router.navigate([
      '/colour-management'
    ]);

  }


  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.router.navigate([
      '/login'
    ]);

  }

}
