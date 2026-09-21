import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  imports: [CommonModule],
  templateUrl: './upload-image.html',
  styleUrl: './upload-image.scss'
})
export class UploadImage {

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private router: Router) {}

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png)/)) {
      alert('Please select a JPG or PNG image.');
      return;
    }

    // Validate file size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10 MB.');
      return;
    }

    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  continueToEditor() {

    if (!this.selectedFile) {
      alert('Please select an image first.');
      return;
    }

    // Temporarily store image for the editor
    localStorage.setItem(
      'roomImage',
      this.imagePreview || ''
    );

    this.router.navigate(['/paint-editor']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}