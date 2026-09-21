import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Point {
  x: number;
  y: number;
}

interface SavedDesign {
  _id?: string;
  userId: string;
  image: string;
  color: string;
  opacity: number;
  date?: string;
}

@Component({
  selector: 'app-paint-editor',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './paint-editor.html',
  styleUrl: './paint-editor.scss'
})
export class PaintEditor implements AfterViewInit {

  @ViewChild('paintCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  selectedColor = '#87CEEB';

  opacity = 50;

  // =====================================================
  // BEFORE / AFTER
  // =====================================================

  showBefore = false;

  // =====================================================
  // UNDO / REDO
  // =====================================================

  private undoStack: string[] = [];

  private redoStack: string[] = [];

  // =====================================================
  // POLYGON SELECTION
  // =====================================================

  points: Point[] = [];

  isSelecting = false;

  selectionFinished = false;

  private originalImage = new Image();


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  // =====================================================
  // INITIALIZE CANVAS
  // =====================================================

  ngAfterViewInit(): void {

    this.ctx =
      this.canvas.nativeElement.getContext('2d')!;

    const savedImage =
      localStorage.getItem('roomImage');

    if (savedImage) {

      this.originalImage.onload = () => {

        this.drawImage();

      };

      this.originalImage.src =
        savedImage;

    } else {

      alert(
        'No room image found. Please upload an image first.'
      );

      this.router.navigate([
        '/upload-image'
      ]);

    }
  }


  // =====================================================
  // DRAW ORIGINAL IMAGE
  // =====================================================

  drawImage(): void {

    const canvas =
      this.canvas.nativeElement;

    const maxWidth = 900;

    const maxHeight = 600;

    let width =
      this.originalImage.width;

    let height =
      this.originalImage.height;

    const scale =
      Math.min(
        maxWidth / width,
        maxHeight / height,
        1
      );

    width *= scale;

    height *= scale;

    canvas.width = width;

    canvas.height = height;

    this.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.ctx.drawImage(
      this.originalImage,
      0,
      0,
      width,
      height
    );

    if (this.points.length > 0) {

      this.drawSelection();

    }
  }


  // =====================================================
  // START SELECTION
  // =====================================================

  startSelection(): void {

    this.points = [];

    this.isSelecting = true;

    this.selectionFinished = false;

    this.showBefore = false;

    this.drawImage();

  }


  // =====================================================
  // CANVAS CLICK
  // =====================================================

  onCanvasClick(event: MouseEvent): void {

    if (!this.isSelecting) {

      return;

    }

    const canvas =
      this.canvas.nativeElement;

    const rect =
      canvas.getBoundingClientRect();

    const scaleX =
      canvas.width / rect.width;

    const scaleY =
      canvas.height / rect.height;

    const x =
      (event.clientX - rect.left) * scaleX;

    const y =
      (event.clientY - rect.top) * scaleY;

    this.points.push({
      x,
      y
    });

    this.drawImage();

  }


  // =====================================================
  // DRAW POLYGON
  // =====================================================

  drawSelection(): void {

    if (this.points.length === 0) {

      return;

    }

    this.ctx.save();

    this.ctx.strokeStyle =
      '#007bff';

    this.ctx.lineWidth = 3;

    this.ctx.fillStyle =
      'rgba(0, 123, 255, 0.15)';

    this.ctx.beginPath();

    this.ctx.moveTo(
      this.points[0].x,
      this.points[0].y
    );

    for (
      let i = 1;
      i < this.points.length;
      i++
    ) {

      this.ctx.lineTo(
        this.points[i].x,
        this.points[i].y
      );

    }

    if (this.selectionFinished) {

      this.ctx.closePath();

      this.ctx.fill();

    }

    this.ctx.stroke();


    // Selection points

    for (const point of this.points) {

      this.ctx.beginPath();

      this.ctx.arc(
        point.x,
        point.y,
        5,
        0,
        Math.PI * 2
      );

      this.ctx.fillStyle =
        '#007bff';

      this.ctx.fill();

    }

    this.ctx.restore();

  }


  // =====================================================
  // FINISH SELECTION
  // =====================================================

  finishSelection(): void {

    if (this.points.length < 3) {

      alert(
        'Please select at least 3 points.'
      );

      return;

    }

    this.isSelecting = false;

    this.selectionFinished = true;

    this.saveCurrentState();

    this.applyPaint();

  }


  // =====================================================
  // CLEAR SELECTION
  // =====================================================

  clearSelection(): void {

    this.points = [];

    this.isSelecting = false;

    this.selectionFinished = false;

    this.drawImage();

  }


  // =====================================================
  // APPLY PAINT
  // =====================================================

  applyPaint(): void {

    if (!this.originalImage.complete) {

      return;

    }

    if (
      this.points.length < 3 ||
      !this.selectionFinished
    ) {

      this.drawImage();

      return;

    }

    // Draw original first

    this.drawImage();

    this.ctx.save();

    this.ctx.beginPath();

    this.ctx.moveTo(
      this.points[0].x,
      this.points[0].y
    );

    for (
      let i = 1;
      i < this.points.length;
      i++
    ) {

      this.ctx.lineTo(
        this.points[i].x,
        this.points[i].y
      );

    }

    this.ctx.closePath();

    this.ctx.clip();

    // Apply opacity

    this.ctx.globalAlpha =
      this.opacity / 100;

    this.ctx.fillStyle =
      this.selectedColor;

    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    this.ctx.restore();

    this.drawSelection();

  }


  // =====================================================
  // SELECT COLOUR
  // =====================================================

  selectColor(color: string): void {

    this.selectedColor = color;

    if (this.selectionFinished) {

      this.saveCurrentState();

      this.applyPaint();

    }

  }


  // =====================================================
  // OPACITY CHANGE
  // =====================================================

  opacityChanged(): void {

    if (this.selectionFinished) {

      this.saveCurrentState();

      this.applyPaint();

    }

  }


  // =====================================================
  // BEFORE / AFTER
  // =====================================================

  toggleBeforeAfter(): void {

    this.showBefore =
      !this.showBefore;

    if (this.showBefore) {

      this.drawOriginalOnly();

    } else {

      if (this.selectionFinished) {

        this.applyPaint();

      } else {

        this.drawImage();

      }

    }

  }


  // =====================================================
  // SHOW ORIGINAL IMAGE
  // =====================================================

  drawOriginalOnly(): void {

    const canvas =
      this.canvas.nativeElement;

    const maxWidth = 900;

    const maxHeight = 600;

    let width =
      this.originalImage.width;

    let height =
      this.originalImage.height;

    const scale =
      Math.min(
        maxWidth / width,
        maxHeight / height,
        1
      );

    width *= scale;

    height *= scale;

    canvas.width = width;

    canvas.height = height;

    this.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.ctx.drawImage(
      this.originalImage,
      0,
      0,
      width,
      height
    );

  }


  // =====================================================
  // UNDO
  // =====================================================

  undo(): void {

    if (this.undoStack.length === 0) {

      alert('Nothing to undo.');

      return;

    }

    const current =
      this.canvas.nativeElement
        .toDataURL('image/png');

    this.redoStack.push(current);

    const previous =
      this.undoStack.pop();

    if (previous) {

      this.restoreCanvas(previous);

    }

  }


  // =====================================================
  // REDO
  // =====================================================

  redo(): void {

    if (this.redoStack.length === 0) {

      alert('Nothing to redo.');

      return;

    }

    const current =
      this.canvas.nativeElement
        .toDataURL('image/png');

    this.undoStack.push(current);

    const next =
      this.redoStack.pop();

    if (next) {

      this.restoreCanvas(next);

    }

  }


  // =====================================================
  // SAVE CURRENT CANVAS STATE
  // =====================================================

  private saveCurrentState(): void {

    if (!this.canvas) {

      return;

    }

    const image =
      this.canvas.nativeElement
        .toDataURL('image/png');

    this.undoStack.push(image);

    this.redoStack = [];

    if (this.undoStack.length > 20) {

      this.undoStack.shift();

    }

  }


  // =====================================================
  // RESTORE CANVAS
  // =====================================================

  private restoreCanvas(
    imageData: string
  ): void {

    const image = new Image();

    image.onload = () => {

      const canvas =
        this.canvas.nativeElement;

      this.ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      this.ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

    };

    image.src = imageData;

  }


  // =====================================================
  // RESET
  // =====================================================

  resetImage(): void {

    this.points = [];

    this.isSelecting = false;

    this.selectionFinished = false;

    this.showBefore = false;

    this.undoStack = [];

    this.redoStack = [];

    this.drawImage();

  }


  // =====================================================
  // SAVE DESIGN TO MONGODB
  // =====================================================

  saveDesign(): void {

    // -----------------------------------------------
    // CHECK LOGIN USER
    // -----------------------------------------------

    const userData =
      localStorage.getItem('user');

    if (!userData) {

      alert(
        'Please login before saving a design.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // -----------------------------------------------
    // GET USER
    // -----------------------------------------------

    let user: any;

    try {

      user =
        JSON.parse(userData);

    } catch {

      alert(
        'User information is invalid. Please login again.'
      );

      localStorage.removeItem('user');

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // -----------------------------------------------
    // GET USER ID
    // -----------------------------------------------

    const userId =
      user._id ||
      user.id ||
      user.userId;


    if (!userId) {

      alert(
        'User ID not found. Please login again.'
      );

      return;

    }


    // -----------------------------------------------
    // GET FINAL IMAGE
    // -----------------------------------------------

    const canvas =
      this.canvas.nativeElement;

    const image =
      canvas.toDataURL('image/png');


    // -----------------------------------------------
    // CREATE DESIGN OBJECT
    // -----------------------------------------------

    const design = {

      userId: userId,

      image: image,

      color: this.selectedColor,

      wallColor: this.selectedColor,

      opacity: this.opacity,

      date: new Date().toLocaleString()

    };


    console.log(
      'Saving design:',
      design
    );


    // -----------------------------------------------
    // SEND TO BACKEND
    // -----------------------------------------------

    this.http
      .post(
        '${environment.apiUrl}/designs',
        design
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Design saved:',
            response
          );

          alert(
            '✅ Design saved successfully!'
          );

        },

        error: (error) => {

          console.error(
            'Save design error:',
            error
          );

          alert(
            '❌ Failed to save design. Please try again.'
          );

        }

      });

  }


  // =====================================================
  // DOWNLOAD IMAGE
  // =====================================================

  downloadImage(): void {

    const canvas =
      this.canvas.nativeElement;

    const link =
      document.createElement('a');

    link.download =
      'smart-wall-painted-room.png';

    link.href =
      canvas.toDataURL('image/png');

    link.click();

  }


  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    this.router.navigate([
      '/upload-image'
    ]);

  }

}
