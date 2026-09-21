import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Colour, PaintColour } from '../../services/colour';

@Component({
  selector: 'app-colour-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './colour-management.html',
  styleUrl: './colour-management.scss'
})
export class ColourManagement {

  newColourName = '';
  newColourCode = '#87CEEB';

  colours: PaintColour[] = [];

  loading = false;

  constructor(
    private router: Router,
    private colourService: Colour
  ) {}

  ngOnInit(): void {
    this.loadColours();
  }

  // Load colours from MongoDB
  loadColours(): void {

    this.loading = true;

    this.colourService.getColours().subscribe({
      next: (data) => {
        this.colours = data;
        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading colours:', error);
        this.loading = false;

        alert('Could not load colours from MongoDB.');
      }
    });
  }

  // Add new colour
  addColour(): void {

    if (!this.newColourName.trim()) {
      alert('Please enter a colour name.');
      return;
    }

    if (!this.newColourCode) {
      alert('Please select a colour.');
      return;
    }

    const newColour: PaintColour = {
      name: this.newColourName.trim(),
      code: this.newColourCode
    };

    this.colourService.addColour(newColour).subscribe({

      next: (response) => {

        this.colours.push(response.colour);

        this.newColourName = '';
        this.newColourCode = '#87CEEB';

        alert('Colour added successfully!');
      },

      error: (error) => {

        console.error('Error adding colour:', error);

        alert('Could not add colour.');
      }

    });
  }

  // Edit colour
  editColour(index: number): void {

    const colour = this.colours[index];

    if (!colour._id) {
      alert('Colour ID not found.');
      return;
    }

    const newName = prompt(
      'Enter new colour name:',
      colour.name
    );

    if (newName === null) {
      return;
    }

    const newCode = prompt(
      'Enter new colour code:',
      colour.code
    );

    if (newCode === null) {
      return;
    }

    if (!newName.trim() || !newCode.trim()) {
      alert('Colour name and code cannot be empty.');
      return;
    }

    const updatedColour: PaintColour = {
      name: newName.trim(),
      code: newCode.trim()
    };

    this.colourService
      .updateColour(colour._id, updatedColour)
      .subscribe({

        next: (response) => {

          this.colours[index] = response.colour;

          alert('Colour updated successfully!');
        },

        error: (error) => {

          console.error('Error updating colour:', error);

          alert('Could not update colour.');
        }

      });
  }

  // Delete colour
  deleteColour(index: number): void {

    const colour = this.colours[index];

    if (!colour._id) {
      alert('Colour ID not found.');
      return;
    }

    const confirmed = confirm(
      `Delete "${colour.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.colourService
      .deleteColour(colour._id)
      .subscribe({

        next: () => {

          this.colours.splice(index, 1);

          alert('Colour deleted successfully!');
        },

        error: (error) => {

          console.error('Error deleting colour:', error);

          alert('Could not delete colour.');
        }

      });
  }

  // Go back to Admin Dashboard
  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}