import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-saved-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-projects.html',
  styleUrl: './saved-projects.scss'
})
export class SavedProjects implements OnInit {

  savedDesigns: any[] = [];
  errorMessage: string = '';

  private apiUrl = 'http://localhost:5000/api/designs';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('==============================');
    console.log('SAVED DESIGNS PAGE');
    console.log('==============================');

    this.loadDesigns();
  }

  loadDesigns(): void {

    this.errorMessage = '';

    console.log('Calling:', this.apiUrl);

    this.http.get<any>(this.apiUrl).subscribe({

      next: (response: any) => {

        console.log('BACKEND SAVED DESIGNS:', response);

        let designs: any[] = [];

        /*
         * Backend normally returns:
         *
         * [
         *   {...},
         *   {...}
         * ]
         */

        if (Array.isArray(response)) {

          designs = response;

        }

        /*
         * Also support:
         * { designs: [...] }
         */

        else if (
          response &&
          Array.isArray(response.designs)
        ) {

          designs = response.designs;

        }

        /*
         * Also support:
         * { data: [...] }
         */

        else if (
          response &&
          Array.isArray(response.data)
        ) {

          designs = response.data;

        }

        console.log(
          'DESIGNS RECEIVED:',
          designs.length
        );

        /*
         * IMPORTANT:
         * Only replace the displayed designs when
         * the backend actually returned an array.
         */

        if (Array.isArray(designs)) {
          this.savedDesigns = designs;
        }

        console.log(
          'DESIGNS CURRENTLY DISPLAYED:',
          this.savedDesigns.length
        );

      },

      error: (error: any) => {

        console.error(
          'FAILED TO LOAD SAVED DESIGNS:',
          error
        );

        this.errorMessage =
          'Unable to connect to the backend.';

      }

    });
  }


  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }


  goToUpload(): void {
    this.router.navigate(['/upload-image']);
  }


  downloadDesign(
    image: string,
    index: number
  ): void {

    if (!image) {
      alert('Image is not available.');
      return;
    }

    const link =
      document.createElement('a');

    link.href = image;

    link.download =
      'room-design-' +
      (index + 1) +
      '.png';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }


  deleteDesign(index: number): void {

    const design =
      this.savedDesigns[index];

    if (!design || !design._id) {

      alert('Design ID not found.');

      return;
    }

    const confirmed =
      confirm(
        'Are you sure you want to delete this design?'
      );

    if (!confirmed) {
      return;
    }

    this.http.delete(
      this.apiUrl + '/' + design._id
    ).subscribe({

      next: () => {

        this.savedDesigns =
          this.savedDesigns.filter(
            (_, i) => i !== index
          );

        alert(
          'Design deleted successfully.'
        );

      },

      error: (error: any) => {

        console.error(
          'DELETE ERROR:',
          error
        );

        alert(
          'Failed to delete the design.'
        );

      }

    });
  }

}