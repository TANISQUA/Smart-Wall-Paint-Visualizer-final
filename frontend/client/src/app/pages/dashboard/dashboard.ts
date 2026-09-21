import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  totalUsers = 0;
  totalColours = 0;
  savedDesigns = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('================================');
    console.log('DASHBOARD STARTED');
    console.log('================================');

    this.loadAllCounts();
  }

  loadAllCounts(): void {

    // ==============================
    // USERS
    // ==============================

    this.http.get<any>(
      '${environment.apiUrl}/auth/users'
    ).subscribe({

      next: (response) => {

        console.log('RAW USERS RESPONSE:', response);

        let users: any[] = [];

        if (Array.isArray(response)) {
          users = response;
        }
        else if (response && Array.isArray(response.users)) {
          users = response.users;
        }
        else if (response && Array.isArray(response.data)) {
          users = response.data;
        }

        this.totalUsers = users.length;

        console.log('USERS ARRAY:', users);
        console.log('TOTAL USERS:', this.totalUsers);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('USERS API ERROR:', error);

        this.totalUsers = 0;

        this.cdr.detectChanges();
      }
    });


    // ==============================
    // COLOURS
    // ==============================

    this.http.get<any>(
      '${environment.apiUrl}/colours'
    ).subscribe({

      next: (response) => {

        console.log('RAW COLOURS RESPONSE:', response);

        let colours: any[] = [];

        if (Array.isArray(response)) {
          colours = response;
        }
        else if (response && Array.isArray(response.colours)) {
          colours = response.colours;
        }
        else if (response && Array.isArray(response.data)) {
          colours = response.data;
        }

        this.totalColours = colours.length;

        console.log('COLOURS ARRAY:', colours);
        console.log('TOTAL COLOURS:', this.totalColours);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('COLOURS API ERROR:', error);

        this.totalColours = 0;

        this.cdr.detectChanges();
      }
    });


    // ==============================
    // SAVED DESIGNS
    // ==============================

    this.http.get<any>(
      '${environment.apiUrl}/designs/count'
    ).subscribe({

      next: (response) => {

        console.log('RAW DESIGNS RESPONSE:', response);

        if (
          response &&
          response.count !== undefined &&
          response.count !== null
        ) {

          this.savedDesigns = Number(response.count);

        } else {

          this.savedDesigns = 0;
        }

        console.log(
          'TOTAL SAVED DESIGNS:',
          this.savedDesigns
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('DESIGNS API ERROR:', error);

        this.savedDesigns = 0;

        this.cdr.detectChanges();
      }
    });
  }


  // ==============================
  // NAVIGATION
  // ==============================

  goToUpload(): void {
    this.router.navigate(['/upload-image']);
  }

  goToEditor(): void {
    this.router.navigate(['/paint-editor']);
  }

  goToSavedProjects(): void {
    this.router.navigate(['/saved-projects']);
  }

  goToColourManagement(): void {
    this.router.navigate(['/colour-management']);
  }

  goToAdminDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }


  // ==============================
  // LOGOUT
  // ==============================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}
