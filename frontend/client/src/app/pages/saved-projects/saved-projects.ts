import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  loading: boolean = true;

  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const pageId =
      Math.random().toString(36).substring(2, 8);

    console.log('================================');
    console.log('SAVED PROJECTS INITIALIZED');
    console.log('PAGE ID:', pageId);
    console.log('================================');

    this.loadSavedDesigns(pageId);
  }


  loadSavedDesigns(pageId: string): void {

    this.loading = true;
    this.errorMessage = '';

    console.log('GETTING DESIGNS FROM MONGODB...');
    console.log('PAGE ID:', pageId);

    this.http
      .get<any>('http://localhost:5000/api/designs')
      .subscribe({

        next: (response: any) => {

          console.log('================================');
          console.log('BACKEND RESPONSE');
          console.log(response);
          console.log('================================');

          let backendDesigns: any[] = [];

          /*
           * Backend normally returns an array.
           */

          if (Array.isArray(response)) {

            backendDesigns = response;

          }

          /*
           * Support { designs: [...] }
           */

          else if (
            response &&
            Array.isArray(response.designs)
          ) {

            backendDesigns = response.designs;

          }

          /*
           * Support { data: [...] }
           */

          else if (
            response &&
            Array.isArray(response.data)
          ) {

            backendDesigns = response.data;

          }


          console.log(
            'MONGODB DESIGNS:',
            backendDesigns.length
          );


          /*
           * Use MongoDB designs.
           */

          if (backendDesigns.length > 0) {

            this.savedDesigns = [...backendDesigns];

            console.log(
              'USING MONGODB DESIGNS:',
              this.savedDesigns.length
            );

          }

          /*
           * MongoDB returned no designs.
           * Check localStorage.
           */

          else {

            console.log(
              'MongoDB returned no designs.'
            );

            const localData =
              localStorage.getItem('savedDesigns');


            if (localData) {

              try {

                const localDesigns =
                  JSON.parse(localData);


                if (Array.isArray(localDesigns)) {

                  this.savedDesigns =
                    [...localDesigns];

                  console.log(
                    'USING LOCAL STORAGE DESIGNS:',
                    this.savedDesigns.length
                  );

                }

              }

              catch (error) {

                console.error(
                  'LOCAL STORAGE PARSE ERROR:',
                  error
                );

              }

            }

          }


          /*
           * Stop loading.
           */

          this.loading = false;

          this.cdr.detectChanges();


          console.log('================================');
          console.log(
            'FINAL DESIGNS:',
            this.savedDesigns.length
          );
          console.log(
            'PAGE ID:',
            pageId
          );
          console.log('================================');

        },


        error: (error: any) => {

          console.error(
            'MONGODB API ERROR:',
            error
          );


          /*
           * Try localStorage if backend fails.
           */

          const localData =
            localStorage.getItem('savedDesigns');


          if (localData) {

            try {

              const localDesigns =
                JSON.parse(localData);


              if (Array.isArray(localDesigns)) {

                this.savedDesigns =
                  [...localDesigns];

              }

            }

            catch (e) {

              console.error(
                'LOCAL STORAGE ERROR:',
                e
              );

            }

          }


          this.loading = false;


          if (this.savedDesigns.length === 0) {

            this.errorMessage =
              'Unable to load saved designs from the server.';

          }


          this.cdr.detectChanges();


          console.log('================================');
          console.log(
            'FINAL DESIGNS AFTER ERROR:',
            this.savedDesigns.length
          );
          console.log(
            'PAGE ID:',
            pageId
          );
          console.log('================================');

        }

      });

  }


  goToDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  goToUpload(): void {

    this.router.navigate([
      '/upload-image'
    ]);

  }


  downloadDesign(
    image: string,
    index: number
  ): void {

    if (!image) {

      alert(
        'Image is not available.'
      );

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


    if (
      !design ||
      !design._id
    ) {

      alert(
        'Design ID not found.'
      );

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this design?'
      );


    if (!confirmed) {

      return;

    }


    this.http
      .delete(
        'http://localhost:5000/api/designs/' +
        design._id
      )
      .subscribe({

        next: () => {

          this.savedDesigns =
            this.savedDesigns.filter(
              (_, i) => i !== index
            );

          this.cdr.detectChanges();


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