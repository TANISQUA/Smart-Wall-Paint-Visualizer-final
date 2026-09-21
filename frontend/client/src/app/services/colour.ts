import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaintColour {
  _id?: string;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class Colour {

  private apiUrl = 'http://localhost:5000/api/colours';

  constructor(private http: HttpClient) {}

  // Get all colours
  getColours(): Observable<PaintColour[]> {
    return this.http.get<PaintColour[]>(this.apiUrl);
  }

  // Add colour
  addColour(colour: PaintColour): Observable<any> {
    return this.http.post(this.apiUrl, colour);
  }

  // Update colour
  updateColour(id: string, colour: PaintColour): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, colour);
  }

  // Delete colour
  deleteColour(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}